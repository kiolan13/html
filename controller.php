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

    public function insert()
    {

        $parameters = $_POST;
        $this->tableByType($parameters);

        $this->b->insert($parameters);

    }

    public function assumption()
    {

        $parameters = $_POST;
        $this->tableByType($parameters);
        $data                    = $this->b->assumption($parameters);

        $parameters["__data"]    = $data;
        $parameters["__varname"] = "data";
        $this->t->assign($parameters);
        
        $result = $this->t->drawparseform($parameters);

        echo $result;

    }

    public function delete()
    {

        $parameters = $_POST;
        $this->tableByType($parameters);

        var_dump($parameters);
        $this->b->delete($parameters);

    }

    public function selectById()
    {

        $parameters = $_POST["ids"];
        $data       = $this->b->selectByIdAt($parameters);
        $result     = json_encode($data);
        echo $result;

    }

    public function listEdById()
    {

        $parameters = $_POST;

        $this->tableByType($parameters);
        $parameters["__data"]    = $this->b->selectById($parameters);
        $parameters["__varname"] = "data";
        $this->t->assign($parameters);

        $result = $this->t->drawparseform($parameters);
        echo $result;

    }

    public function drawform()
    {

        $parameters = $_POST;

        $result = $this->t->drawform($parameters);
        echo $result;

    }

    public function drawformwithsettings() 
    {
         $parameters = $_POST;
         $data = $this->t->drawformwithsettings($parameters);
         $result = json_encode($data);
         echo $result;
    }

    public function drawparseform($inparameters)
    {

        if ($inparameters === null) {
            $parameters = $_POST;

            $this->tableByType($parameters);
            $parameters["__data"] = $this->b->select($parameters);

        } else {
            $parameters = $inparameters;
        }

        $parameters["__varname"] = "data";
        $this->t->assign($parameters);
        $data = $this->t->drawparseform($parameters);
        $result = json_encode($data);

        echo $result;

    }

    public function tableByType(&$parameters)
    {

        $type = $parameters["type"];
        $tablename;
        if ($type === "undefined") {
            $tablename = "Entity";
            echo "no type recieved";

        } elseif ($type === "en") {
            $tablename = "Entity";

        } elseif ($type === "at") {
            $tablename = "Attribute";
        }

        $parameters["tablename"] = $tablename;

    }

}
