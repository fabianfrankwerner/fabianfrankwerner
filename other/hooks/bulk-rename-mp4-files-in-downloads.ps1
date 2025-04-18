$folderPath = "$env:USERPROFILE\Downloads"
$files = Get-ChildItem -Path $folderPath -Filter "*.mp4" | Sort-Object LastWriteTime
$counter = 1

foreach ($file in $files) {
    $newName = "hook-$counter.mp4"
    $newPath = Join-Path -Path $folderPath -ChildPath $newName
    Rename-Item -Path $file.FullName -NewName $newPath
    $counter++
}

Write-Output "Task completed successfully."
