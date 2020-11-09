---
layout: default
title: Lambdas
nav_order: 7
---

# Lambdas

Lambdas stellen nach den [definierten Tickets](https://github.com/maximilian-skowron/dhge-cc-aufg-sem-2/projects/1) ein Teil des MVP 2 dar.
Unter [Lösungsarchitektur](https://maximilian-skowron.github.io/dhge-cc-aufg-sem-2/solutions.html) wurde die Aufgabe der Lambdas zum ersten mal aufgezeigt.
Die Lambdas dienen zum Starten bzw. Stoppen der Beanstalk Instanzen, um sinnlose Ressourcenkosten außerhalb von typischen Arbeitszeiten zu verhindern.

> Die Lambdas als auch die jetzt beschriebene Eventbridge sind nicht Teil des Terraform Skripts momentan!

Es wurden zwei Lambdas erstellt.
Eine dient dem Starten und die Andere dem Stoppen der einzelnen Instanzen.
Jede dieser Lambdas hört auf Veränderungen bei der Event Bridge.

Eine Event Bridge überwacht gewisse Regeln und löst vorher definierte Abläufe aus, wenn diese Regeln eintreffen.
In diese Fall gibt es eine Regel zu starten bzw. beenden der Instanzen.

Bei den Regeln handelt es sich um Cronjobs, welche nach einem definierten Zeitraum ausgelöst werden.

## Event Bridge Regeln

**StartLambdaFunction**-Regel:

`0 8 ? * MON,TUE,WED,THU,FRI *`

Folgender Cron Ausdruck sagt aus, dass die Regel um 08:00 Uhr Wochentags ausgeführt wird.
In diesem Fall triggert die Regel eine Lambda Funktion welche die Instanzen startet.

**StopLambdaFunction**-Regel:

`0 18 ? * MON,TUE,WED,THU,FRI *`

Dieser Cron Ausdruck sorgt um 18:00 Uhr Wochentags für das Ausführen der Lambda Funktion, um die Instanzen zu stoppen.

> Alle Zeitangaben sind in UTC!


## Lambda Funktionen

Die Lambda Funktionen sind in Python geschrieben.
Es wird das `boto3` Package genutzt, welches eine Python SDK für die AWS bereitstellt.

Mit `boto3.client("elasticbeanstalk")` kann ein Client Objekt erzeugt werden.
Diesem wird im `Handler` die ID der Elastic Beanstalk Umgebung mitgegeben.
Je nachdem ob die Instanzen gestartet oder beendet werden wird `client.rebuild_environment(..)` oder `client.terminate_environment(..)` aufgerufen.
