---
layout: default
title: Infrastruktur
nav_order: 4
---

# 3 Infrastruktur bereitstellen

Die Infrastruktur soll reproduzierbar und nachvollziehbar sein.
Um dieses Ziel zu erreichen müssen Skripte in irgendeiner Art verwendet werden.

Innerhalb dieser Ausarbeitung wird Terraform als Infrastructur Provisioner genutzt.

## Setups

### Repository Setup

Als erstes muss das Repository lokal geklont werden.

```bash
git clone https://github.com/maximilian-skowron/dhge-cc-aufg-sem-2.git && cd dhge-cc-aufg-sem-2
```

### AWS-Setup

Das Einrichten von AWS ist nur möglich insofern Zugang zu den IAM Einstellungen vorhanden ist. Nicht möglich mit AWS Educate.

Sollte der Zugang gesichert sein, müssen folgende Schritte ausgeführt werden innerhalb der IAM Einstellungen:

1. Admin Gruppe erstellen mit `Administrator Access` Berechtigung.
2. Anlegen eines programmgesteuerten Terraform Users in der vorher erstellten Admin Gruppe.
3. Es muss ein Sicherheitsschlüssel generiert werden. Dieser ist im nachfolgenden Kapitel wichtig!

### Terraform Setup

Terraform muss auf dem lokalen Rechner installiert sein.
Sollten mehrere Entwickler Infrastruktur bereitstellen, sollte ein Managment Tool wie Terraform Cloud eingerichtet werden.

Für die Installation bitte der Dokumentation auf [der Terraform Website](https://www.terraform.io/docs/enterprise/install/installer.html) folgen.

---

Innerhalb des Terraform-Ordners muss der Befehl `terraform init` ausgeführt werden, damit der AWS Provider heruntergeladen werden kann.

Innerhalb des Terraform Ordners des Repositorys muss nun noch eine `var.tfvars` Datei angelegt werden, welche die Secrets des AWS Users halten werden. 
Auch müssen dort die Namen der S3 Buckets definiert werden.
Dort wird folgender Inhalt erstellt:

```
ak = "Access Key des Terraform Nutzers"
sk = "Secret Key des Terraform Nutzers"
upload-bucket-name = "name-of-upload-bucket"
result-bucket-name = "name-of-result-bucket"
```

> Benennung ist wichtig! Die Namen von S3 Buckets müssen bei AWS global EINDEUTIG sein.

### Infrastruktur bereitstellen

Die Infrastruktur kann mit dem folgenden Befehl aufgebaut werden:

```bash
terraform apply -var-file="var.tfvars"
```

Nach der Erstellung des Plans, wird gefragt ob soweit alles in Ordnung ist.
Hier muss mit `yes` bestätigt werden.

> Die Infrastruktur wird standardmäßig in eu-central-1 bereitgestellt.

Sollte eine andere Region gewollt sein, muss entweder die Flag `-var 'region=..'` mitgegeben werden oder die `tfvars` Datei angepasst werden:

```
ak = "Access Key des Terraform Nutzers"
sk = "Secret Key des Terraform Nutzers"
...
region = "us-east-1"
```

> Generell können alle Variablen, die in der `variables.tf` Datei definiert wurden, mittels dem `-var` Flag oder der `tfvars` Datei überschrieben werden.

## Erklärung Terraform Skript

### Terraform-Variablen, die vom Skript unterstützt werden

| Variable Name      	| Beschreibung                                                                                       	| Default Wert 	| Beispielwert       	|
|--------------------	|----------------------------------------------------------------------------------------------------	|--------------	|--------------------	|
| region             	| AWS Region, in der alle Ressourcen erstellt werden.                                                 	| eu-central-1 	| us-east-1          	|
| ak                 	| Access Key des Terraform Nutzers.                                                                  	| /            	| dkfjwfn..          	|
| sk                 	| Secret Key des Terraform Nutzers.                                                                  	| /            	| vcienl..           	|
| upload-bucket-name 	| Name des S3 Buckets, in dem hochgeladene Dokumente gespeichert werden. (global eindeutig)              	| /            	| dhge-upload-bucket 	|
| result-bucket-name 	| Name des S3 Buckets, in dem die Ergebnisse und Transformationen gespeichert werden. (global eindeutig) 	| /            	| dhge-result-bucket 	|
| instance-type      	| Typ der EC2 VMs für Elastic Beanstalk.                                                             	| t2.micro     	| t2.large           	|

### Terraform-Skript 

Der Provider definiert Ressourcen und Datentypen innerhalb der `.tf` Dateien und stellt eine Verbindung mit der AWS bereit.
Alle Informationen über die möglichen Konfigurationen und wie man den Provider benutzt findet man in der [Dokumentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs).

```hcl
provider "aws" {
  version    = "~> 3.0"
  region     = var.region
  access_key = var.ak
  secret_key = var.sk
}
```

Mit dem folgenden Befehl können S3 Buckets innerhalb der AWS bereitgestellt werden. 
Wichtig ist diese auf privat einzustellen, damit sie nicht öffentlich zugänglich sind.

```hcl
resource "aws_s3_bucket" "sim_bucket_re" {
  bucket = var.result-bucket-name
  acl    = "private"
}
```

Den größten Teil der Terraform Konfiguration stellt das Einrichten von Elastic Beanstalk dar.
Da beim Erstellen einer Beanstalk Umgebung und App mittels Terraform keine Rollen und Rechte angelegt werden, wie bei der Variante über die GUI oder die CLI, müssen diese selbst eingerichtet werden.

```hcl
resource "aws_elastic_beanstalk_application" "beanstalk" {
  name        = "dhge-sim-beanstalk-app"
  description = "Holds the simulation application."
}

resource "aws_elastic_beanstalk_environment" "beanstalk_env" {
  name                = "dhge-sim-beanstalk"
  application         = aws_elastic_beanstalk_application.beanstalk.name
  solution_stack_name = "64bit Amazon Linux 2 v5.2.1 running Node.js 12"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "${aws_iam_instance_profile.beanstalk_ec2.name}"
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = "1"
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "1"
  }
}
```

Es werden Konfigurationen, wie die maximale Anzahl an Instanzen und deren Größe definiert. 
Dies ist sehr klein gewählt, kann aber wenn nötig hochgestuft werden.

Die Beanstalk-Umgebung referenziert für die `lauchconfiguration` eine weitere Terraform Ressource.
Und zwar ein `instance_profile`, welches wiederum verschiedene Rollen und Rechte benötigt, um z.B. EC2 Instanzen starten zu können. 