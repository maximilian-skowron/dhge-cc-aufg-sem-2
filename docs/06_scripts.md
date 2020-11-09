---
layout: default
title: Scripts
nav_order: 6
---

# Skripte

Das Bashskript wird benötigt, um die Applikation auszuführen und die Bildtransformation zu starten.
Grob kann man es in drei Teile unterteilen.

1. Upload
2. Start der Transformation
3. Download

## Upload

Das Skript ist in der Lage nicht nur einzelne Dateien, sondern ganze Ordnerinhalte hochzuladen.
Dafür wird eine Bashfunktion angelegt.
Innerhalb der Funktion wird mit dem AWS CLI Tool (`aws`) die entsprechend übergebene Datei in den vorher angelegten Bucket kopiert.

```bash
function putS3
{
  path=$1
  file=$2
  aws s3 cp $1/$2 s3://dhge-sim-bucket-upload/ --acl public-read
}
```

Dieser werden alle unter dem Zielordner befindlichen Objekte übergeben.

```bash
for file in "$path"/*; do
  #transfering all object in path to s3
  putS3 "$path" "${file##*/}" "/"
done
```

Danach wird mit `wget` und der URL der Beanstalk-App die Transformation / Simulation gestartet.
Dabei muss die URL auf `/start` enden.
Da innerhalb der Beanstalk App ein Endpunkt definiert wurde.

Zu letzt kann mit dem Befehl `aws s3 sync s3://bucketname ./ziel/pfad` der Ordnerinhalt des Ergebnis Buckets mit einem Ordner auf dem lokalen Dateisystem synchronisiert werden.