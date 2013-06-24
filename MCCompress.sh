#!/bin/bash

########################## Help ############################

function helpMCcompresse()
{
  echo "
	 скрипт предназначен для сжатия файлов 
	 
         реализовано сжатие форматов: 
         .js - через http://closure-compiler.appspot.com/ 
         .css - через http://cssminifier.com/ 

	 параметры(* помечены обязательные параметры):
	 *1 - путь к папке, в которой будут находится сомпилированные файлы,
              если передано в первый параметр '-h', выведется справка о данном скрипте
	 *2 - путь к файлу, в котором содержится список скриптов для компилирования (подробнее о списке в readme.md)
	 3 - отвечает за способ компилирования и записи:
             - '-o' - все будет скомпилировано в один файл
             - '-s' - все будет скомпилировано в разные файлы
	     если не передан, пользователь будет спрошен о способе компилирования	 

         паттерн: что-то типо(поскольку bash не объектно-ориентирован) фабричного метода

         зависимости: curl, gzip

         проект на github.com - 

	 автор: Андрей Вахрушев aka andreich, andreich2013@ukr.net
	 
"
}

# спросим у пользователя как он хочет компилировать файлы
# 1. Компилировать все в один файл
# 2. Компилировать все в разные файлы
# возвращает boolean
function askHowToCompile()
{
  select opt in "compile_to_one_file" "compile_to_several_files"; do
    if [ "$opt" = "compile_to_one_file" ]; then
      local isOneFile=true
      break
    elif [ "$opt" = "compile_to_several_files" ]; then
      local isOneFile=false
      break
    fi
  done

  echo $isOneFile
}
################# Compile Files ############################

# конкретная реализация компилирования JS файлов через
# Google Closure Compilier
function compileJS()
{
  local currentDir=`pwd`
  cd `dirname "$1"`

  echo код файла "$1" компилируется... > /dev/tty

  # отправляем POST в Google Closure Compilier
  curl -s \
  -d compilation_level=SIMPLE_OPTIMIZATIONS \
  -d output_format=text \
  -d output_info=compiled_code \
  --data-urlencode "js_code@`basename "$1"`" \
  http://closure-compiler.appspot.com/compile \
  > "$tempDir"/temporaryScript.txt

  local dataAfterCompile=`less "$tempDir"/temporaryScript.txt`

  cd "$currentDir"

  echo "$dataAfterCompile"
}

# конкретная реализация компилирования CSS файлов через
# cssminifier.com
function compileCSS()
{
  local currentDir=`pwd`
  cd `dirname "$1"`

  echo код файла "$1" компилируется... > /dev/tty

  # отправляем POST в cssminifier.com
  curl -X \
  POST -s \
  --data-urlencode "input@`basename "$1"`" \
  http://cssminifier.com/raw \
  > "$tempDir"/temporaryScript.txt

  local dataAfterCompile=`less "$tempDir"/temporaryScript.txt`

  cd "$currentDir"

  echo "$dataAfterCompile"
}

# выполняет компилирование исходного кода файла
# 1 параметр - строка с абсолютным путем к файлу
# пример "/home/andreich/www/musei/public_html/js/jquery-1.9.1.js"
# возвращает код скомпилированного файла
function compileFile () 
{
  #создадим временный файл, в который 
  #будем ложить скомпилированный код
  if [ ! -f "$tempDir"/temporaryScript.txt ]
  then
    touch "$tempDir"/temporaryScript.txt
  fi

  if [ ! -z $(echo `expr "$1" : '\(\S\\+\.js\)'`) ]
  then
    local dataAfterCompile=`compileJS "$1"`
  elif [ ! -z $(echo `expr "$1" : '\(\S\\+\.css\)'`) ]
  then
    local dataAfterCompile=`compileCSS "$1"`
  else 
    echo передан неверный файл для компиляции "$1"
  fi

  echo "$dataAfterCompile"
}

################# Add Files ############################

# конкретная реализация добавления скомпилированного
# JS кода в файл
function addFileJS()
{
  if [ "$3" = true ]
  then

    #создадим файл script.js, если его нет
    if [ ! -f "$4"/script.js ]
    then
      touch "$4"/script.js
    fi

    echo скомпилированный код файла "$2" записывается в "$4"/script.js...
    #local tempData=`echo "$1" | sed -r '/\/\*/{:com;N;s/\/\*(.*)\*\///g;T com};'`
    echo "$1" | sed -e '$a;' >>"$4"/script.js

  else
     
    fileToMinifedData=`basename "$2"`
    if [ -z $(echo `expr "$fileToMinifedData" : '.*\(\.min.js\)'`) ]
    then
      fileToMinifedData=${fileToMinifedData/%\.js/.min.js}
    fi

    echo скомпилированный код файла "$2" записывается в "$4"/"$fileToMinifedData"...
    echo "$1" >"$4"/"$fileToMinifedData"

  fi

  echo "" >"$tempDir"/temporaryScript.txt
}

# конкретная реализация добавления скомпилированного
# CCS кода в файл
function addFileCCS()
{
  if [ "$3" = true ]
  then

    #создадим файл script.js, если его нет
    if [ ! -f "$4"/style.css ]
    then
      touch "$4"/style.css
    fi

    echo скомпилированный код файла "$2" записывается в "$4"/style.css...
    echo "$1" >>"$4"/style.css

  else
     
    fileToMinifedData=`basename "$2"`
    if [ -z $(echo `expr "$fileToMinifedData" : '.*\(\.min.js\)'`) ]
    then
      fileToMinifedData=${fileToMinifedData/%\.css/.min.css}
    fi

    echo скомпилированный код файла "$2" записывается в "$4"/"$fileToMinifedData"...
    echo "$1" >"$4"/"$fileToMinifedData"

  fi

  echo "" >"$tempDir"/temporaryScript.txt
}


# добавляем исходный код в файл
# 1 параметр - строка с кодом, который необходимо добавить
# 2 параметр - файл исходного кода
# 3 параметр - флаг, указывающий компилировать в 1 файл 
# или в разные
# 4 параметр - папка, в которую будем все складывать
function addFile()
{
  if [ ! -z $(echo `expr "$2" : '\(\S\\+\.js\)'`) ]
  then
    addFileJS "$1" "$2" "$3" "$4"
  elif [ ! -z $(echo `expr "$2" : '\(\S\\+\.css\)'`) ]
  then
    addFileCCS "$1" "$2" "$3" "$4"
  fi
}

################# Compress Files #########################

# конкретная реализация сжатия для файлов JS
function compressFilesJS()
{
  for i in "$1"/*.js
  do 
    gzip -c "$i" > ${i}.gz
  done 
}

# конкретная реализация сжатия для файлов CSS
function compressFilesCSS()
{
  for i in "$1"/*.css
  do 
    gzip -c "$i" > ${i}.gz
  done
}

# сжатие файлов в .gz архив
# 1 параметр - папка, в которой содержаться файлы
function compressFiles()
{
  local currentDir=`pwd`

  echo выполняется сжатие... > /dev/tty
  
  cd "$1"

  local isExistsJS=`ls | file --mime-type *.js | grep 'text' | sed -e 's/\(:.*\)//g;'`
  local isExistsCSS=`ls | file --mime-type *.css | grep 'text' | sed -e 's/\(:.*\)//g;'`
  
  cd "$currentDir"

  if [ ! -z "$isExistsJS" ]
  then
    compressFilesJS "$1"
  fi
  
  if [ ! -z "$isExistsCSS" ]
  then
    compressFilesCSS "$1"
  fi
  
}

##################собственно выполнение##############################

#переменные

if [ -z $1 ]
then
  echo не передан один из обязательных параметров, обратитесь, пожалуйста, за помощью к параметру '-h'
  exit
elif [ $1 = "-h" ]
then
  helpMCcompresse
  exit
fi

if [ -z $2 ]
then
  echo не передан один из обязательных параметров, обратитесь, пожалуйста, за помощью к параметру '-h'
  exit
fi


prodDir=$1
scriptList=$2
tempDir=${RANDOM}`date +%s`

if [ -z $3 ]
then
  isOneFile=`askHowToCompile`
elif [ $3 = "-o" ]
then
  isOneFile=true
elif [ $3 = "-s" ]
then
  isOneFile=false
else
  isOneFile=`askHowToCompile`
fi

#создадим временную папку, с которой будем работать
mkdir /tmp/"$tempDir"
tempDir=/tmp/"$tempDir"

# создадим папку production, если ее нет
if [ ! -d "$prodDir" ]; then
  mkdir "$prodDir"
fi

if [ ! -f $scriptList ]
then
  echo не указан файл со списком скриптов для компилирования, обратитесь, пожалуйста, за помощью к параметру '-h'
  exit
fi

#пробежимся по строкам файла и скомпилим нужные скрипты
COUNTER=0
cat $scriptList | while read str; do
  let COUNTER=COUNTER+1
  
  # если нет ключа "add" в строке, тогда не включаем файл из строки
  if [ -z $(echo `expr "$str" : '\(\<add\>\)'`) ]
  then
    continue
  fi

  #находим строку с именем файла
  fileToCompile=$(echo `echo "$str" | grep -o '\( file:\S\+\)' | sed -e "s/\(file\:\)//"`)
  if [ -z $fileToCompile ]
  then
    echo не найдена подстрока с именем файла для компиляции в строке "$COUNTER"
    continue
  fi
  
  if [ ! -f "$fileToCompile" ]
  then 
    echo файл "$fileToCompile" не найден
    continue
  else
    
    if [ ! -z $(echo `echo "$str" | grep -o '\(\<compile\>\)'`) ]
    then
      dataCompiled=`compileFile "$fileToCompile"`
    else
      dataCompiled=`less "$fileToCompile"`
    fi
    
    addFile "$dataCompiled" "$fileToCompile" "$isOneFile" "$tempDir"

  fi

done

# создадим gzip для браузеров его понимающих
compressFiles "$tempDir"

echo скомпилированные файлы копируются в "$prodDir"
cp "$tempDir"/*[^.txt] "$prodDir"

rm -rf "$tempDir"
