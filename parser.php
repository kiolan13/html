<?php

class Parser extends Base
{

    public function __construct()
    {
        $this->init();

    }

    public function init()
    {
        $this->parseurl();
    }

    public function parseurl()
    {

        $controller;
        $controllername;
        $actionname;

        $request = $_SERVER["REQUEST_URI"];

        $parsearray = explode("/", $request);

        $controllername = $parsearray[1];

        if ($controllername === "index") {

            $controller = new Controller;

            if (isset($parsearray[2])) {

                if (method_exists($controller, $parsearray[2])) {

                    $actionname = $parsearray[2];

                    $controller->$actionname();

                }

            } else {

                $controller->index();

            }

        }

        //$controllername = "Controller";

        //$controller = new $controllername;

    }

}
