---
layout: default
title: Beanstalk Applikation
nav_order: 5
---

# Beanstalk und EB Applikation 

Elastic Beanstalk (EB) ist AWS Möglichkeit Code auf einer einfach skalierbaren Umgebung auszuführen und Versionen zu verwalten.
In der Beispiel Anwendung wird davon ausgegangen, dass das Simulationsprogramm als Code vorliegt und auf einem EB bereitgestellt werden soll.

## Applikation

Da sich bei der Bereistellung von EB für `nodeJs` entschieden wurde muss eine NodeJs App erstellt werden.
Die App kann in diesem Repository unter ... gefunden werden.

## Code auf Beanstalk bereitstellen

Es gibt generell zwei Möglichkeiten Code auf Beanstalk bereitzustellen. 
Einmal über die UI und über ein von AWS bereitgestelltes CLI Tool.

### CLI

Der empfohlene Weg die CLI zu installieren ist mittels eines [Installation Skripts.](https://github.com/aws/aws-elastic-beanstalk-cli-setup)

Danach kann im App Ordner `eb init` ausgeführt werden. 
Sollte man noch nicht angemeldet sein kann dies nun ausgeführt werden.
Danach muss das bestehende Beanstalk Environment zusammen mit der Beispielapplikation ausgewählt werden.
Sollte die Applikation eine UI im Browser bereistellen kann mit `eb open` die URL geöffnet werden, wenn noch keine App selbst deployt wurde sieht man die Beispiel NodeJs Oberfläche.

Mit dem Befehl `eb deploy` kann nun eine neue Version der EB App hochgeladen werden.
Es wird eine automatisch generierte Versionsnummer genutzt, um das Deployment unterscheidbar zu machen.
Sollte es gewollt sein ein einen eigenen Versionsnamen zu vergeben kann die Flag `--version Versionsname` genutzt werden.

Mit `eb terminate` kann die App entfernt werden.

### GUI

Für den GUI Upload muss keine zusätzliche Software installiert werden.
Folgende Schritte müssen ausgeführt werden:

1. Der Inhalt des App Ordners muss gezipt werden. 

> Es muss NUR der Inhalt des Ordners gezipt werden NICHT der Ordner für sich. Das würde zu einem kryptischen Fehlercode führen.

2. Innerhalb der EB Umgebung > "Hochladen und bereitstellen"
3. Zip Datei hochladen
4. (optional) eindeutigen Versionsnamen festlege
5. Bereistellen