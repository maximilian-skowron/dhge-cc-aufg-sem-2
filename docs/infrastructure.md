---
layout: default
title: Infrastruktur
nav_order: 4
---

# 3 Infrastruktur bereitstellen

Die Infrastruktur soll reproduzierbar und nachvollziehbar sein.
Um dieses Ziel zu erreichen müssen Skripte in irgendeiner Art verwendet werden.

Innerhalb dieser Ausarbeitung wird Terraform als Infrastructur Provisioner genutzt.

## Setup Repository

Als erstes muss das Repository lokal geclont werden.

```bash
git clone https://github.com/maximilian-skowron/dhge-cc-aufg-sem-2.git && cd dhge-cc-aufg-sem-2
```

## Setups

### AWS Setup

Das einrichten von AWS ist nur möglich insofern Zugang zu den IAM Einstellungen vorhanden ist. Nicht möglich mit AWS Educate.

Sollte der Zugang gesichert sein müssen folgende Schritte ausgeführt werden innerhalb der IAM Einstellungen:

1. Admin Gruppe erstellen mit `Administrator Access` Berechtigung.
2. Anlegen eines programmgesteuerten Terraform Users in der vorher erstellten Admin Gruppe.
3. Es muss ein Sicherheitsschlüssel generiert werden. Dieser ist im nachfolgenden Kapitel wichtig!

### Setup Terraform

Terraform muss auf dem lokalen Rechner installiert sein.
Sollten mehrere Entwickler Infrastruktur bereitstellen sollte ein Managment Tool wie Terraform Cloud eingerichtet werden.

Für die Installation bitte der Dokumentation auf [der Terraform Website](https://www.terraform.io/docs/enterprise/install/installer.html) folgen.

---

Innerhalb des Terraform Ordners des Reposiotries muss nun noch eine `var.tfvars` Datei angelegt werden, welche die Secrets des AWS Users halten werden.
Dort wird folgender Inhalt erstellt:

```
ak = "Access Key des Terraform Nutzers"
sk = "Secret Key des Terraform Nutzers"
```

> Namensgebung ist wichtig!

### Infrastruktur bereitstellen

Die Infrastruktur kann num mittels folgendem Befehl aufgebaut werden:

```bash
terraform apply -var-file="var.tfvars"
```

Anschließend nach der Erstellung des Plans wird gefragt ob soweit alles in Ordnung ist.
Hier muss mit `yes` bestätigt werden.

> Die Infrastruktur wird standardmäßig in eu-central-1 bereitgestellt.

Sollte eine andere Region gewollt sein muss entweder die Flag `-var 'region=..'` mitgegeben werden oder die `tfvars` Datei angepasst werden:

```
ak = "Access Key des Terraform Nutzers"
sk = "Secret Key des Terraform Nutzers"
region = "us-east-1"
```

## Erklärung Terraform Skript
