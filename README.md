MCCompress
==========

MCCompress

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
