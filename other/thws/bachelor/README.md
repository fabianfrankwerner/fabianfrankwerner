# Vorlagen für Projekt-, Bachelor- und Masterarbeiten

Dieses Repository enthält Vorlagen, die für Projekt-, Bachelor- und Masterarbeiten verwendet werden können -- aber nicht müssen. Sprechen Sie mit Ihrem Betreuer bzw. Ihrer Betreuerin über die jeweiligen Anforderungen an die Formatierung der Arbeit und die gewünschte Zitierweise. Sie dürfen diese Vorlagen dann gerne anpassen.

Bitte beachten Sie, dass nach § 26 (3) bzw. § 30 (8) der Allgemeinen Prüfungsordnung (APO) alle diese Arbeiten mit einer Selbstständigkeitserklärung zu versehen sind, die von Ihnen in einer gedruckten Version der Arbeit auch handschriftlich unterschrieben sein muss. Eine Vorlage für den Text befindet sich in der Datei "20180927_Eidesstattliche_Erklärung".

Jede Arbeit muss von den Prüfern auf Plagiate geprüft werden können. Daher geben Sie Ihre Arbeit gemäß § 30 (8) Satz 2 der APO in zwei digitalen Versionen ab: einmal mit Angabe von Namen und Matrikelnummer und einmal ohne diese Angaben.

- Wenn Sie mit der Überprüfung auf Plagiate in der nicht-anonymen Version der Arbeit einverstanden sind, fügen Sie bitte der Arbeit noch eine entsprechende Erklärung hinzu. Eine Vorlage dafür befindet sich in der Datei "20180927_Zustimmung_zur_Plagiatsüberprüfung".

- In der anonymisierten Version der Arbeit ist diese Erklärung nicht notwendig.

# QR Code

Sie haben mit der Bestätigung der Anmeldung der Bachelor- bzw. Masterarbeit
einen QR Code als Anlage zur E-Mail erhalten. Bitte kopieren Sie diesen Code
in das Arbeitsverzeichnis Ihres Projektes und fügen Sie den Code als Bild
entweder auf dem Deckblatt (z.B. rechts unten) oder auf der Rückseite des
Deckblatts (so wie in den Vorlagen) hinzu. Sie vereinfachen uns damit
die Verbuchung der Abgabe der Arbeit.

# Microsoft Word

Bei Verwendung von Microsoft Word benutzen Sie bitte die Datei "Vorlage_Word_Thesis.docx".

# LaTeX

Die LaTeX Vorlage befindet sich in der Datei "thesis.tex" und eine Vorlage für die Literaturliste in der Datei "literatur.bib".

Für die Erzeugung des Literaturverzeichnisses wird in der Vorlage nicht mehr das Tool `bibtex` sondern das neuere Tool `biber` verwendet.

Zur Übersetzung der LaTeX Datei in PDF können Sie in der Console unter macOS oder Linux einfach
den Befehl `make` verwenden. Wenn Sie einen LaTeX Editor, wie zum Beispiel
Texpad oder Overleaf verwenden, benutzen Sie natürlich die dortige Funktion
zur Übersetzung.

Für die Erstellung der zwei notwendigen Versionen Ihrer Arbeit (einmal anonym, einmal mit Nennung von Namen und Matrikelnummer) existiert in der LaTeX Vorlage folgende Abfrage:

```
\ifdefined\iswithfullname
  \def\ShowBaAuthor{\BaAuthor}
\else
  \def\ShowBaAuthor{N.~N.}
\fi
```

Dies überprüft, ob die Variable `iswithfullname` auf der Kommandozeile beim Starten von PDFLaTeX gesetzt wurde oder nicht. Wenn sie gesetzt wurde, wird der volle Name des Autors angezeigt, andernfalls durch N. N. ersetzt. Wenn das beiliegende Makefile benutzt wird, werden die zwei geforderten Versionen automatisch erzeugt. Wenn andere Werkzeuge benutzt werden, muss das Setzen dieser Variablen selbst vorgenommen werden. Notfalls, wenn alle anderen Lösungen nicht funktionieren sollten, kommentiert man die obige Abfrage entsprechend aus und setzt die
Variable `ShowBaAuthor` selbst. Wichtig, in der Arbeit muss immer das Makro `ShowBaAuthor` verwendet werden, wenn man den Namen des Autors angeben möchte.

# Frist für die Abgabe der Arbeit

Sie haben mit der E-Mail zur Bestätigung der Anmeldung der Bachelor- bzw. Masterarbeit ein Datum genannt bekommen, bis zu dem die Arbeit _spätestens_ abzugeben ist.

Diese Frist wird automatisch durch eine Software in Abhängigkeit von der Bearbeitungszeit berechnet und ist immer ein Werktag (Montag bis Freitag, ohne Feiertage).

Die beiden digitalen Versionen der Arbeit schicken Sie bitte fristgemäß per E-Mail
an Ihren Betreuer bzw. Ihre Betreuerin und _nicht_ an das Dekanat.

# Checkliste für die Abgabe der Arbeit

Vor der Abgabe der Arbeit prüfen Sie bitte folgende Punkte:

- [ ] Enthält das Deckblatt den Titel der Arbeit, Ihren Namen, die Namen der beiden Prüfer bzw. Prüferinnen und das Datum der tatsächlichen Abgabe?

- [ ] Sind die beiden Kurzfassungen auf Deutsch und Englisch enthalten?

- [ ] Ist die Selbstständigkeitserklärung enthalten und unterschrieben?

- [ ] Ist die Zustimmung zur Plagiatsüberprüfung enthalten und unterschrieben?

- [ ] Ist der QR Code auf dem Deckblatt oder der Rückseite des Deckblatts enthalten?
