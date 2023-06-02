# media-manager


useful commands to prepare media files:

rename files to md5:
```bash
md5sum ./* | sed -e 's/\([^ ]*\)[ ]*\(.*\(\..*\)\)$/mv -v "\2" "\1\3"/' | sh
```

add md5 prefix to files:
```
md5sum ./* | sed -e 's/\([^ ]*\)[ ]*\(.+*\/\(.*\)\(\..*\)\)$/mv -v "\2" "\1 -- \3\4"/'
```
