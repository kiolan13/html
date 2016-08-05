<?php

class Template
{

    public $forms;
    public $parameters = [];

    public function __construct()
    {

        $this->init();

    }

    public function init()
    {


        $filename    = "forms.json";
        $myfile      = fopen($filename, "r");
        $content     = fread($myfile, filesize($filename));
        $this->forms = json_decode($content, true);
        

    }


    public function draw($filename)
    {


        $myfile  = fopen($filename, "r");
        $content = fread($myfile, filesize($filename));

        return $content;

    }

    public function getfiledate($filename)
    {

        $myfile  = fopen($filename, "r");
        $content = fread($myfile, filesize($filename));
        return $content;

    }

    public function parse($content)
    {

        
        //$pattern = "/{loop=(.+?)}(.+){\/loop}|{(.+?)}/";

        $pattern = "/loop\[(.+?)\]:{(.+?)}/s";

        $res = preg_replace_callback($pattern,
            function ($matches) {

                return $this->parseloop($matches);
   
                
            },
            $content);

        return $res;

    }

    public function parseloop($inmatches)
    {

        $pattern = "/((\w+)\[(.+?)\]/";

        $res     = preg_replace_callback($pattern,
            function ($matches) {

                if ($matches[1] != "") {
                    
                }

            },
            $inmatches[2]);

        return $res;

    }

  
    public function drawform($parameters)
    {


        $formname = $parameters["formname"];
        $filename = $this->forms[$formname]["filename"];
        $html = $this->draw($filename, false);

        echo $html;

    }

    public function drawparseform($parameters)
    {


        $formname = $parameters["formname"];
        $filename = $this->forms[$formname]["filename"];
        $content = $this->draw($filename);

        
        $result = $this->parse($content);

        return $result;
        

    }

    public function assign($parameters)
    {
        
        $varname = $parameters["__varname"];
        $this->parameters[$varname] = $parameters;
         
    }

}
