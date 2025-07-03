# friend_subscriber.py
import paho.mqtt.client as mqtt
import json
import csv
import os

MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
MQTT_TOPIC = "mpu6050/yourname/data"  # must match your topic exactly
CSV_FILE = "mpu6050_log.csv"

# Create CSV file with headers if it doesn't exist
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Timestamp', 'Pitch', 'Roll', 'Yaw'])

def on_connect(client, userdata, flags, rc):
    print("Connected. Subscribing to topic...")
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())
        timestamp = data['timestamp']
        pitch = data['pitch']
        roll = data['roll']
        yaw = data['yaw']

        print(f"[{timestamp}] Pitch: {pitch}, Roll: {roll}, Yaw: {yaw}")

        # Write to CSV
        with open(CSV_FILE, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([timestamp, pitch, roll, yaw])

    except Exception as e:
        print("Error parsing:", e)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_forever()
