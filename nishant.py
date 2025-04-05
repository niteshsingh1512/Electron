import os
import shutil
import tempfile
from flask import Flask, jsonify
import subprocess
import json
import psutil
import datetime
from collections import defaultdict

app = Flask(__name__)


@app.route('/clear_temp_files', methods=['POST'])
def clear_temp_files():
    temp_dirs = [
        os.environ.get('TEMP'),
        os.environ.get('TMP'),
        r'C:\Windows\Temp'
    ]

    deleted_files = []
    failed_files = []

    for temp_dir in temp_dirs:
        if temp_dir and os.path.exists(temp_dir):
            for root, dirs, files in os.walk(temp_dir):
                for name in files:
                    file_path = os.path.join(root, name)
                    try:
                        os.remove(file_path)
                        deleted_files.append(file_path)
                    except Exception as e:
                        failed_files.append({"file": file_path, "error": str(e)})
                for name in dirs:
                    dir_path = os.path.join(root, name)
                    try:
                        shutil.rmtree(dir_path, ignore_errors=True)
                        deleted_files.append(dir_path)
                    except Exception as e:
                        failed_files.append({"dir": dir_path, "error": str(e)})

    return jsonify({
        "deleted": len(deleted_files),
        "failed": failed_files[:10],  # return only first 10 failed for brevity
        "message": "Temp file cleanup complete."
    })

@app.route('/check_driver_updates', methods=['GET'])
def check_driver_updates():
    ps_command = r'''
    $Session = New-Object -ComObject "Microsoft.Update.Session"
    $Searcher = $Session.CreateUpdateSearcher()
    $Searcher.Online = $true
    $Results = $Searcher.Search("IsInstalled=0 and Type='Driver'")
    $Updates = @()
    foreach ($Update in $Results.Updates) {
        $Updates += [PSCustomObject]@{
            Title = $Update.Title
            DriverManufacturer = $Update.DriverManufacturer
            DriverVersion = $Update.DriverVersion
        }
    }
    $Updates | ConvertTo-Json
    '''

    try:
        result = subprocess.run(["powershell", "-Command", ps_command], capture_output=True, text=True, timeout=60)
        if result.returncode != 0:
            return jsonify({"error": "Failed to check for driver updates", "details": result.stderr}), 500

        updates_json = result.stdout.strip()
        if not updates_json:
            return jsonify({"message": "No driver updates available."}), 200

        updates = json.loads(updates_json)
        if isinstance(updates, dict):
            updates = [updates]

        return jsonify({"driver_updates": updates})

    except subprocess.TimeoutExpired:
        return jsonify({"error": "Driver check timed out."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/app_usage', methods=['GET'])
def app_usage():
    usage = defaultdict(float)
    now = datetime.datetime.now()
    last_24_hours = now - datetime.timedelta(hours=24)

    for proc in psutil.process_iter(['pid', 'name', 'create_time']):
        try:
            create_time = datetime.datetime.fromtimestamp(proc.info['create_time'])
            if create_time > last_24_hours:
                runtime = (now - create_time).total_seconds() / 60  # in minutes
                usage[proc.info['name']] += runtime
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

    sorted_usage = sorted(usage.items(), key=lambda x: x[1], reverse=True)
    result = [{"app": app, "usage_minutes": round(minutes, 2)} for app, minutes in sorted_usage]

    return jsonify({"app_usage": result})

@app.route('/network-usage', methods=['GET'])
def network_usage():
    usage = defaultdict(lambda: {'bytes_sent': 0, 'bytes_recv': 0})
    now = datetime.datetime.now()
    last_24_hours = now - datetime.timedelta(hours=24)

    for conn in psutil.net_connections(kind='inet'):
        try:
            pid = conn.pid
            if pid is None:
                continue

            proc = psutil.Process(pid)
            create_time = datetime.datetime.fromtimestamp(proc.create_time())
            if create_time < last_24_hours:
                continue

            name = proc.name()
            net_io = proc.io_counters() if hasattr(proc, 'io_counters') else None
            if net_io:
                usage[name]['bytes_sent'] += net_io.write_bytes
                usage[name]['bytes_recv'] += net_io.read_bytes

        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

    result = []
    for app, data in usage.items():
        result.append({
            "app": app,
            "upload_MB": round(data['bytes_sent'] / (1024 * 1024), 2),
            "download_MB": round(data['bytes_recv'] / (1024 * 1024), 2)
        })

    result = sorted(result, key=lambda x: x["download_MB"] + x["upload_MB"], reverse=True)
    return jsonify({"network_usage": result})

@app.route('/system-scan', methods=['GET'])
def system_scan():
    ps_script = r'''
    Start-MpScan -ScanType QuickScan
    Start-Sleep -Seconds 5
    $threats = Get-MpThreat
    if ($threats) {
        $threats | Select-Object ThreatName, SeverityID, Resources | ConvertTo-Json
    } else {
        ConvertTo-Json @{"status"="No threats detected"}
    }
    '''

    try:
        result = subprocess.run(["powershell", "-Command", ps_script],
                                capture_output=True, text=True, timeout=120)

        if result.returncode != 0:
            return jsonify({"error": "Scan failed", "details": result.stderr}), 500

        output = result.stdout.strip()
        threats = json.loads(output)

        if isinstance(threats, dict) and "status" in threats:
            return jsonify({"system_health": threats["status"]})
        else:
            return jsonify({"malicious_files": threats})

    except subprocess.TimeoutExpired:
        return jsonify({"error": "Scan timed out."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
