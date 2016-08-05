<?php

class Model
{

    public $connection;
    public $servername = "localhost";
    public $username   = "root";
    public $password   = "root";

    public function __construct()
    {

        $this->init();
    }

    public function init()
    {

        $res = $this->createconnection($this->connection, $this->servername, $this->username, $this->password);

        $this->usedb($this->connection, "base");

        //$this->createtableAttribute($this->connection, "base", "Attribute");
        //$this->droptable($this->connection, "base", "Attributes");

    }
    public function connect()
    {

    }
    public function createdb($connection, $dbname)
    {

        $query = "CREATE DATABASE " . $dbname;
        if ($connection->query($query) === true) {
            echo "Database created successfully";
        } else {
            echo "Error creating database: " . $connection->error;
        }

    }

    public function dropdb($connection, $dbname)
    {
        $query = "DROP DATABASE " . $dbname;
        if ($connection->query($query) === true) {
            echo "Database dropped successfully";
        } else {
            echo "Error dropping database: " . $connection->error;
        }

    }
    public function createconnection(&$connection, $servername, $username, $password)
    {
        $connection = new mysqli($servername, $username, $password);
        if ($connection->connect_error) {
            die("Connection error: " . $connection->connect_error);
        } else {

            return true;
        }

    }
    public function createtable($connection, $dbname, $tablename)
    {

        $this->usedb($connection, $dbname);

        $query = "CREATE TABLE " . $tablename . "(
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR (30) NOT NULL,
            text TEXT NOT NULL,
            attributes TEXT NOT NULL
        ) COLLATE cp1251_bin";
        if ($connection->query($query) === true) {
            echo "Table created successfully";
        } else {
            echo "Error creating table: " . $connection->error;
        }

    }
    public function createtableEntity($connection, $dbname, $tablename)
    {

        $this->usedb($connection, $dbname);

        $query = "CREATE TABLE " . $tablename . "(
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR (30) NOT NULL,
            text TEXT NOT NULL,
            attributes TEXT NOT NULL
        ) COLLATE cp1251_bin";
        if ($connection->query($query) === true) {
            echo "Table created successfully";
        } else {
            echo "Error creating table: " . $connection->error;
        }

    }

    public function droptable($connection, $dbname, $tablename)
    {
        $this->usedb($connection, $dbname);

        $query = "DROP TABLE " . $tablename;

        if ($connection->query($query) === true) {
            echo "Table dropped successfully";
        } else {
            echo "Error dropping table: " . $connection->error;
        }
    }
    public function usedb($connection, $dbname)
    {

        $query = "USE " . $dbname;
        if ($connection->query($query) === true) {
            //echo "Database used successfully";
        } else {
            //echo "Error using database: " . $connection->error;
        }

    }
    public function setnames()
    {
        $connection = $this->connection;
        $query      = "SET NAMES utf8_bin";
        $connection->query($query);
    }

    public function insert($parameters)
    {

        $connection = $this->connection;

        $q     = "INSERT INTO Attribute (name, text) VALUES ('%s', '%s')";
        $query = vsprintf($q, $parameters);

        if ($connection->query($query) === true) {
            echo "Data inserted successfully";
        } else {
            echo "Error inserting data: " . $connection->error;
        }
    }



    public function select()
    {

        $connection = $this->connection;
        $query      = "SELECT * FROM Entity";
        $result     = $connection->query($query);
        $data       = [];

        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            array_push($data, $row);
        }

        return $data;

    }


    public function assumption($parameters)
    {

        $connection = $this->connection;
        $parameters = "%" . $parameters . "%";

        //$stmt = $connection->prepare("SELECT * FROM Attribute WHERE name LIKE ?");
        //$stmt->bind_param("s", $parameters);
        //$stmt->execute();
        //$result = $stmt->get_result();

        $q      = "SELECT * FROM Entity WHERE name LIKE '%s'";
        $query  = vsprintf($q, $parameters);
        $result = $connection->query($query);

        $data = [];

        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            array_push($data, $row);
        }

        return $data;
    }



    public function delete($parameters)
    {

        $connection = $this->connection;

        $q     = "DELETE FROM Entity WHERE id in (%s)";
        $query = vsprintf($q, $parameters);

        if ($connection->query($query) === true) {
            echo "Data deleted successfully";
        } else {
            echo "Error deleting data: " . $connection->error;
        }

    }

   

    public function selectById($parameters)
    {

        $connection = $this->connection;

        $q     = "SELECT * FROM Entity WHERE id in (%s)";
        $query = vsprintf($q, $parameters);

        $result = $connection->query($query);

        $data = [];

        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            array_push($data, $row);
        }

        return $data;

    }


}
