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
                $i          = $this->i;

                return $this->parameters[$varname][$i][$subvarname];

            },
            $content);

        return $res;

    }

    public function drawform($parameters)
    {

        $formname = $parameters["formname"];
        $filename = $this->forms[$formname]["filename"];
        $html     = $this->draw($filename);

        //$html     = $this->draw($filename, false);

        echo $html;

    }

    public function drawformwithsettings($parameters)
    {

        $result = $this->prepare($parameters);
        return $result;
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
    public function prepare($parameters)
    {
        $formname                     = $parameters["formname"];
        $filename                     = $this->forms[$formname]["filename"];
        $html                         = $this->draw($filename);
        $form                         = $this->forms[$formname];
        $result                       = [];
        $parameters["html"]           = $html;
        $parameters["form"]           = $form;
        $parameters["activeelements"] = [];
        $parameters["inids"]          = [];
        if (isset($form["activeelements"])) {
            $parameters["targetarray"] = $form["activeelements"];
            $parameters["selector"]    = "id";
            $parameters["resultname"]  = "activeelements";

            $parameters = $this->findandreplaceall($parameters);
        }
        if (isset($form["inids"])) {
            $parameters["targetarray"]      = $form["inids"];
            $parameters["selector"]   = "id";
            $parameters["resultname"] = "inids";

            $parameters = $this->findandreplaceall($parameters);
        }

        $result["html"]           = $parameters["html"];
        $result["activeelements"] = $parameters["activeelements"];
        $result["inids"]          = $parameters["inids"];

        return $result;

    }
    public function findandreplaceall($parameters)
    {
        $html        = $parameters["html"];
        $targetarray = $parameters["targetarray"];
        $selector    = $parameters["selector"];
        $resultname  = $parameters["resultname"];
        $l           = count($targetarray);
        for ($i = 0; $i < $l; $i++) {
            $id                         = $targetarray[$i][$selector];
            $newid                      = $this->generateid();
            $targetarray[$i][$selector] = $newid;
            $html                       = $this->replace($id, $newid, $html);
        }

        $parameters["html"]       = $html;
        $parameters[$resultname] = $targetarray;

        return $parameters;

    }
    public function generateid()
    {
        $result = "id" . rand(10000, 90000) . rand(1000, 9000);
        return $result;
    }
    public function replace($target, $replacment, $data)
    {
        $data = preg_replace("/" . $target . "/", $replacment, $data);
        return $data;
    }

}
