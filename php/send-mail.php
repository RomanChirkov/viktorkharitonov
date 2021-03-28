<?php

namespace BRANDSFORGE\Mail;

use Exception;

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 


$allowOrigin = [
  "http://localhost:8080/brandsforge/",
  // "https://wiseway.lv",
];

if ($_FILES && $_FILES['design']['error'] == UPLOAD_ERR_OK)
{
    $name = $_FILES['design']['name'];
    move_uploaded_file($_FILES['design']['tmp_name'], $name);
}

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

  public static function phone($name) {
    $check = filter_var($name, FILTER_VALIDATE_REGEXP, [
      "options" => ["regexp"=>"/^(\+)?(\(\d{2,3}\) ?\d|\d)(([ \-]?\d)|( ?\(\d{2,3}\) ?)){5,12}\d$/"],
      ]
    );

    if (!$check){
      throw new Exception('Wrong phone format');
    }
    else{
      return $name;
    }
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
    $name = Utils::text(Utils::post("name"));
    $phoneNumber = Utils::phone(Utils::post("phoneNumber"));
    $email = Utils::email(Utils::post("email"));
    $message = Utils::text(Utils::post("aboutProject"));
    $picture = ""; 

    // Если поле выбора вложения не пустое - закачиваем его на сервер 

    if (!empty($_FILES['design']['tmp_name'])) 
    { 
      // Закачиваем файл 
      $path = $_FILES['design']['name']; 
      $picture = $path;
      // if (move_uploaded_file($_FILES['design']['tmp_name'], $path)) {  //tmp_name
      //   $picture = $path; 
      // }
    } 

    // Вспомогательная функция для отправки почтового сообщения с вложением 

    function send_mail($to, $thm, $html, $path) 
    { 
      $email = Utils::email(Utils::post("email"));

      $fp = fopen($path,"r"); 
      if (!$fp) 
      { 
        print "Файл $path не может быть прочитан"; 
        exit(); 
      }

      $file = fread($fp, filesize($path)); 
      fclose($fp); 

      $boundary = "--".md5(uniqid(time())); // генерируем разделитель 
      $headers = "From: {$email}" . "\r\n" .
      "Reply-To: skolnik335@gmail.com\r\n" .
      "X-Mailer: PHP/" . phpversion();
      $headers .= "MIME-Version: 1.0\n"; 
      $headers .="Content-Type: multipart/mixed; boundary=\"$boundary\"\n"; //
      
      $multipart = "--$boundary\n"; 
      $kod = 'UTF-8';
      $multipart .= "Content-Type: text/html; charset=$kod\n"; 
      $multipart .= "Content-Transfer-Encoding: Quot-Printed\n\n"; 
      $multipart .= "$html\n\n"; 
      $message_part = "--$boundary\n"; 
      $message_part .= "Content-Type: application/octet-stream\n"; 
      $message_part .= "Content-Transfer-Encoding: base64\n"; 
      $message_part .= "Content-Disposition: attachment; filename = \"".$path."\"\n\n"; 
      $message_part .= chunk_split(base64_encode($file))."\n"; 
      $multipart .= $message_part."--$boundary--\n"; 
    
      mail($to, $thm, $multipart, $headers);
    } 

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

    $txt = "name: {$name}" . " ";
    $txt .= "phoneNumber: {$phoneNumber}" . " ";
    $txt .= "email: {$email}" . " ";
    $txt .= "short info about project: {$message}" . " ";

    // Отправляем почтовое сообщение 

    if(empty($picture)) {
       mail($to, $subject, $txt, $headers); 
    }
    else {
      send_mail($to, $subject, $txt, $picture); 
      unlink ($picture);
    }

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
