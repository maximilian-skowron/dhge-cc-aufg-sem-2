---
layout: default
title: Lösungsarchitekturen
nav_order: 3
---

# 2 Lösungsarchitekturen

Bei der Aufgabenstellung kann von zwei verschiedenen Möglichkeiten ausgegangen werden.
So kann ein Simulationsprogramm entweder als Code oder als eine Form von Executable vorliegen.
Je nach entsprechender Art kann eine andere AWS spezifische Lösung angestrebt werden.

Innerhalb dieser Ausarbeitung wird von einer Anwendung in Form von Programmcode ausgegangen.

## Simulationsprogramm als Executable

![Simulationprogramm als Executable](/images/existing_sim.png)

Hier können verschiedene modernste Technologien zum Einsatz kommen.
So kann entweder die bereitgestellte virtuelle Maschine durch Consule verwaltet werden.
Oder das zugrundeliegende Machine Image wird durch Packer mit nötigen Programmen angereichert.

Entsprechende Infrastruktur (VMs, VPCs, ..) kann durch Terraform und in beschränkter Form auch durch Consul bereitgestellt werden.
Als Terraform-Alternative würde sich auch das nicht Cloud-agnostische und hauseigene Cloud Foundation von AWS anbieten.

## Simulationsprogramm als Code

Sollte die Application als Code vorliegen, bietet AWS die Möglichkeit entsprechenden Programmcode mit Hilfe von Beanstalk zu hosten.

![Simulationsprogramm als Code](/images/code_sim.png)

Beanstalk ist in einem Autoscaling Pool von EC2 Instanzen aufgespannt und bietet für die verschiedensten Programmiersprachen vorgefertigte Umgebungen.
In diesem Fall kann auf Consul und Packer verzichtet werden.
Die Aufgabe zum Bereitstellen von der Infrastruktur kann durch Terraform übernommen werden.
