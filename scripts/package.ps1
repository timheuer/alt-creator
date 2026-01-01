# Package extension for store submission
Remove-Item store/alt-creator.zip -ErrorAction SilentlyContinue
$temp = "store/temp-zip"
New-Item -ItemType Directory -Path $temp -Force | Out-Null
Copy-Item manifest.json $temp
Copy-Item -Recurse background $temp
Copy-Item -Recurse content $temp
Copy-Item -Recurse popup $temp
New-Item -ItemType Directory -Path "$temp/icons" -Force | Out-Null
Copy-Item icons/*.png "$temp/icons/"
Compress-Archive -Path "$temp/*" -DestinationPath store/alt-creator.zip -Force
Remove-Item -Recurse $temp
Write-Host "Created store/alt-creator.zip"
