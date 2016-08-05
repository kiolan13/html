<?php

include "template.php";
include "model.php";

class Controller
{

    public $t;
    public $b;

    public function __construct()
    {

        $this->init();
    }

    public function init()
    {

        $this->t = new Template;
        $this->b = new Model;

    }

    public function index()
    {

        $parameters["formname"] = "index";
        $this->t->drawform($parameters);

    }

    public function eNaddtopr()
    {

        $parameters = $_POST["addids"];
        $data       = $this->b->selectByIdAt($parameters);
        $result     = json_encode($data);
        echo $result;

    }

    public function eNttInsert()
    {

        $name       = $_POST["name"];
        $text       = $_POST["text"];
        $attributes = $_POST["attributes"];

        $parameters = [];

        array_push($parameters, $name, $text, $attributes);

        $this->b->insertEn($parameters);

    }

    public function aTtrInsert()
    {

        $name = $_POST["name"];
        $text = $_POST["text"];

        $parameters = [];

        array_push($parameters, $name, $text);

        $this->b->insertAt($parameters);

    }

    public function openlist()
    {

        $data = $this->b->select();

        $result = json_encode($data);

        echo $result;

    }

    public function assumption()
    {

        $parameters = $_POST["searchstring"];
        $data       = $this->b->assumptionEn($parameters);
        $result     = json_encode($data);
        echo $result;

    }

    public function deletefrom()
    {

        $parameters = $_POST["deleteids"];

        $this->b->deleteEn($parameters);

    }

    public function selectById()
    {

        $parameters = $_POST["ids"];
        $data       = $this->b->selectByIdAt($parameters);
        $result     = json_encode($data);
        echo $result;

    }

    public function generateeditlistAt()
    {

        $ids        = $_POST["ids"];
        $parameters = [];

        array_push($parameters, $ids);

        $data = $this->b->selectByIdAt($parameters);

        $result = json_encode($data);
        echo $result;

    }

    public function drawform()
    {

        $parameters = $_POST;

        $result = $this->t->drawform($parameters);
        echo $result;

    }

    public function drawparseform()
    {


        $parameters = $_POST;

        $data = $this->b->select();
        $result = $this->t->drawparseform($parameters);

        $parameters["__varname"] = "data";

        $this->t->assign($parameters);

        //echo $this->t->parameters["data"]["formname"];

        echo $result;

    }

}
