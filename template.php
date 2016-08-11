<?php

class Template
{

    public $forms;
    public $parameters = [];
    public $i          = 0;
    public $l          = 0;

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
        $i;
        $l;
        $parameters = [];
        $result;
        $pattern = "/loop\['(.+?)'\]:{(.+?)}/s";

        //$matches[0] - full string
        //$matches[1] - variable name
        //$matches[2] - subvariable name

        $result = preg_replace_callback($pattern,
            function ($matches) {

                $res                   = "";
                $varname               = $matches[1];
                $l                     = count($this->parameters[$varname]);
                $parameters["content"] = $matches[2];

                for ($i = 0; $i < $l; $i++) {

                    $this->i = $i;
                    $res .= $this->parseloop($parameters);

                }

                return $res;

            },
            $content);

        return $result;

    }

    public function parseloop($parameters)
    {

        $varname;
        $subvarname;
        $content = $parameters["content"];

        $pattern = "/(\w+)\['(.+?)'\]/";

        $res = preg_replace_callback($pattern,
            function ($matches) {

                $varname    = $matches[1];
                $subvarname = $matches[2];
                $i = $this->i;

                return $this->parameters[$varname][$i][$subvarname];

            },
            $content);

        return $res;

    }

    public function drawform($parameters)
    {

        $formname = $parameters["formname"];
        $filename = $this->forms[$formname]["filename"];
        $html     = $this->draw($filename, false);

        echo $html;

    }

    public function drawparseform($parameters)
    {


        $formname = $parameters["formname"];
        $filename = $this->forms[$formname]["filename"];
        $content  = $this->draw($filename);

        $result = $this->parse($content);

       

        return $result;

    }

    public function assign($parameters)
    {

        $varname = $parameters["__varname"];
       
    

        if (!isset($this->parameters[$varname])) {
            $this->parameters[$varname] = [];
        }

        $this->parameters[$varname] = array_merge($this->parameters[$varname], $parameters["__data"]);
        

    }

}
