<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli('thelax67.beget.tech', 'thelax67_mysql', '7f0tQ&F4', 'thelax67_mysql');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = $conn->query("SELECT * FROM `FullBase`");

$type = $_SERVER["REQUEST_METHOD"];

if ($type == "GET") {
    $json = array();
    while ($row = $data->fetch_assoc()) {
        $json[] = $row;
    }

    echo json_encode($json);
} else if ($type == "POST") {
    $post = json_decode(file_get_contents("php://input"), true);

    foreach ($post as $obj) {
        $id = $obj['id'];
        $owner = $obj['owner'];
        $price = $obj['price'];;
        $for_sale = $obj['for_sale'];
        $updated_at = $obj['updated_at'];
        $port = $obj['port'];
        $airport = $obj['airport'];
        $volcano = $obj['volcano'];
        $mystery = $obj['mystery'];
        $crops = $obj['crops'];
        $fruit = $obj['fruit'];
        $minerals = $obj['minerals'];
        $raw_meat = $obj['raw_meat'];
        $titanium = $obj['titanium'];
        $fish = $obj['fish'];
        $iron = $obj['iron'];
        $oil = $obj['oil'];
        $stone = $obj['stone'];
        $wood = $obj['wood'];
        $name = $obj['name'];
        $country_count = $obj['country_count'];
        $countries = $obj['countries'];
        $urban_count = $obj['urban_count'];
        $urban_areas = $obj['urban_areas'];
        $water = $obj['water'];
        $is_reserved = $obj['is_reserved'];

        $query = "UPDATE `FullBase` SET `owner`='$owner', `price`='$price', `for_sale`='$for_sale', `updated_at`='$updated_at',`port`='$port',`airport`='$airport',`volcano`='$volcano',
        `mystery`='$mystery',`crops`='$crops',`fruit`='$fruit',`minerals`='$minerals',`raw_meat`='$raw_meat',`titanium`='$titanium',`fish`='$fish',`iron`='$iron',
        `oil`='$oil',`stone`='$stone',`wood`='$wood',`name`='$name',`country_count`='$country_count',`countries`='$countries',`urban_count`='$urban_count',
        `urban_areas`='$urban_areas',`water`='$water',`is_reserved`='$is_reserved' WHERE `id`='$id'";

        $conn->query($query);
    }
    if ($conn->error)
        echo json_encode(array(
            "status" => false,
            "message" => $conn->error
        ));
    else echo json_encode(array(
        "status" => true,
        "message" => "UPDATED",
    ));
}

$conn->close();