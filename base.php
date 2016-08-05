<?php

include "controller.php";
include "parser.php";

class Base
{

    public $p;
    public $c;

    public function __construct()
    {

        $this->init();

    }
    public function init()
    {

        $this->p = new Parser;

    }

}
