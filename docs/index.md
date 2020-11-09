---
layout: default
title: Abstract
nav_order: 1
permalink: /
---

# Abstract

Ziel des Projektes war es eine Lösungsarchitektur innerhalb der Cloud zu konzeptionieren, dokumentieren und bereitzustellen. 
Die Lösung sollte dabei möglichst anpassbar gestaltet werden und am besten neuere Technologien bezüglich DevOps und Infrastructure as Code beinhalten. 

Dabei wurde versucht eine Lösung zu erstellen, welche es Mitarbeitern ermöglicht Dateien in die Cloud zu laden und dort rechenintensive Prozesse ablaufen zu lassen.
Als möglicher Anwendungsfall wurde hier ein in der cloud laufendes Simulationsprogramm angenommen.

Mittels neuster Methoden der Software Entwicklung, wie Infrastructure as a Code (Terraform), wurde die App komplett in der AWS Cloud umgesetzt.
Dem Endnutzer wird ein einfaches Bashscript zur Verfügung gestellt zusammen mit der entsprechenden Nutzungsdokumentation.
Das Skript lädt alle Dateien innerhalb eines Ordners oder eine einzelne Bilddatei in einen S3 Bucket hoch.
Dann wird das Simulationsprogramm, welches mittels Beanstalk gehostet ist gestartet.
Die Ergebnisse werden dann auf dem lokalen System synchronisiert.

Zusätzlich zur Kernfunktion wurde auch ein Start Stopp Mechanismuss mittels Cronjobs und Lambdas erstellt.
Dieser ermöglicht es die Beanstalk Instanzen herunter bzw. hochzufahren, um Kosten zu vermeiden. 