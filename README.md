# styl-migration
A script for converting your STYL files to SCSS


# Installing
You have to install [zx](https://github.com/google/zx) globally for this script to work.
After, You have to also install [stylus-converter](https://www.npmjs.com/package/stylus-converter) globally.

# Running 
For the script stylus.migration.mjs to work properly, you have to run it inside the repo folder so you will have to manually copy it there to start.
Hint: For Windows you have to provide the executing shell executable.
Easiest thing if you want to execute it is to run: 
```shell
npx zx --shell=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe ./stylus.migration.mjs
```


# Known Limits
- Using CSS variables it might duplicate the `var(--name)` to `var(var(--name))`.
- base64 encoded strings are converted incorrectly, removing the `;` inbetween the format and base64.
- divisions might be fucked after the migration because SCSS disallows the usage of `/`. You have to convert division to use `math.div(4,2)` or `calc(4/2)`


# Why?
Don't want to manually edit hundreds of files.

![[img](https://pics.me.me/tv-14-dlsv-jerry-will-you-please-just-let-me-66802831.png)](https://pics.me.me/tv-14-dlsv-jerry-will-you-please-just-let-me-66802831.png)
