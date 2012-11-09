# jQuery Loader
Lightweight jQuery plugin for dynamically loading local dependencies at runtime.

### Example

	$(function ()
	{
	  $.loader(["test1", "test2", "test3", "test4"], {basePath: "./fixtures/"}, function ()
	  {
	      console.log("Everything has loaded!");
	  });
	});