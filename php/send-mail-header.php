<?php

namespace BRANDSFORGE\Mail;

use Exception;

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 


$allowOrigin = [
  "http://localhost:8080/brandsforge/",
  // "https://wiseway.lv",
];

if (in_array($_SERVER["HTTP_ORIGIN"], $allowOrigin)) {
  header("Access-Control-Allow-Origin: {$_SERVER["HTTP_ORIGIN"]}", false);
}

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
  throw new Exception("
    <b>Error</b> {$errstr} <b>$errfile</b> on line <b>{$errline}</b>
  ", $errno);
});

class Utils
{
  public static function email($email)
  {
    return filter_var($email, FILTER_VALIDATE_EMAIL, FILTER_NULL_ON_FAILURE);
  }

  public static function text($text)
  {
    if (is_null($text)) {
      return null;
    }

    return filter_var($text, FILTER_SANITIZE_STRING, FILTER_NULL_ON_FAILURE);
  }

  public static function post($name, $default = null)
  {
    return self::prepare(filter_input(INPUT_POST, $name, FILTER_SANITIZE_STRING), $default);
  }

  private static function prepare($result, $default)
  {
    if (is_null($default)) {
      return $result;
    } elseif (is_null($result)) {
      return $default;
    }

    return $result;
  }
}

  try {
    $message = Utils::text(Utils::post("message"));
    $name = Utils::text(Utils::post("user_name"));
    $email = Utils::email(Utils::post("user_email"));

    $to = 'skolnik335@gmail.com';
    $subject = "Brandsforge";

    if (is_null($name) || strlen($name) === 0) {
      throw new Exception("Name not specified");
    }

    if (is_null($email)) {
      throw new Exception("Wrong email");
    }

    $headers = "From: {$email}" . "\r\n" .
      "Reply-To: skolnik335@gmail.com\r\n" .
      "X-Mailer: PHP/" . phpversion();

    $txt = "message: {$message}" . " ";
    $txt .= "user_name: {$name}" . " ";
    $txt .= "user_email: {$email}" . " ";

    mail($to, $subject, $txt, $headers); 


    echo json_encode([
      "status" => "success",
      "message" => "Mail sent",
    ]);
  } catch (Exception $ex) {
  echo json_encode([
    "status" => "error",
    "message" => $ex->getMessage(),
  ]);
}
