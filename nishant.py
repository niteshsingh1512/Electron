from flask import Flask, jsonify
import subprocess
import json
import psutil
import datetime
from collections import defaultdict
from plyer import notification

app = Flask(__name__)

# === Existing Routes ===
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


# === NEW ROUTE: Chrome Tabs Detection ===
@app.route('/chrome-tabs', methods=['GET'])
def chrome_tabs():
    memory_threshold_mb = 800   # Total memory usage threshold
    cpu_threshold_percent = 50  # Total CPU usage threshold

    total_memory = 0  # in bytes
    total_cpu = 0.0   # as a percentage
    processes = []

    for proc in psutil.process_iter(['name', 'memory_info', 'cpu_percent']):
        try:
            if proc.info['name'] and 'chrome' in proc.info['name'].lower():
                # Accumulate memory usage
                mem = proc.info['memory_info'].rss if proc.info['memory_info'] else 0
                cpu = proc.cpu_percent(interval=0.1)  # More accurate with short interval

                total_memory += mem
                total_cpu += cpu
                processes.append(proc.pid)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

    total_memory_mb = round(total_memory / (1024 * 1024), 2)
    total_cpu = round(total_cpu, 2)

    alert_sent = False
    message = None

    if total_memory_mb > memory_threshold_mb or total_cpu > cpu_threshold_percent:
        alert_sent = True
        message = f"Chrome is using {total_memory_mb} MB RAM and {total_cpu}% CPU!"
        notification.notify(
            title="⚠️ High Chrome Resource Usage",
            message=message,
            timeout=10
        )

    return jsonify({
        "chrome_memory_MB": total_memory_mb,
        "chrome_cpu_percent": total_cpu,
        "alert_sent": alert_sent,
        "pids_checked": processes,
        "message": message if alert_sent else "Within normal limits"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
