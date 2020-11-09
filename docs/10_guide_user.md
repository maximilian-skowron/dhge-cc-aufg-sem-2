---
layout: default
parent: "How To's"
title: How To - Nutzer
nav_order: 8
---

# How To - Nutzer

## Checkliste

- AWS CLI installieren
- mit Nutzeraccount bei der CLI anmelden (`aws configure`)
- Bashskript Werte umtauschen

## Vorgehen

Als Nutzer müssen mit den Entwicklern folgende Dinge geklärt werden:

- Die Namen der AWS Buckets
- Der Name und die ID der Beanstalk Instanz

Innerhalb des Bash Skripts müssen nun mehrere Zeilen ersetzt werden:

- `aws s3 cp $1/$2 s3://name-des-upload-bucket/ --acl public-read`
- `wget http://name-der-beanstalk-app.id-der-beanstalk-umgebung.eu-central-1.elasticbeanstalk.com/start`
- `aws s3 sync s3://name-des-Ergebniss-bucket "$dest"`

Danach muss der Nutzer sich noch gegen das AWS Projekt authentifizieren mittels `aws configure`.
Ein Entwickler oder Sysadmin sollte für jeden Nutzer einen Account anlegen mit den entsprechenden Berechtigungen.

Dan kann das Bashskript mit `./start.sh ./pfad/zum/bild/oder/ordner ./pfad/zum/speichern/der/ergebnisse`.

Das Skript kann sowohl alle Dateien in einem Ordner oder eine einzelne Datei hochladen.