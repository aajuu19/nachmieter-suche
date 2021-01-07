<?php 
session_start(); 
if($_SESSION) {
    echo json_encode($_SESSION);
} else {
    return false;
}