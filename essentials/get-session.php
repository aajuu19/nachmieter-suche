<?php 
session_start(); 
if($_SESSION['person']) {
    echo json_encode($_SESSION['person']);
} else {
    return false;
}