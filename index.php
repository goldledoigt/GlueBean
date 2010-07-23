<?php

class gluebean {
	function gluebean() {
		$this->db = new db();
		srand();
	}

	function start() {
		if (!isset($_REQUEST['page'])) {
			$_REQUEST['page'] = 'main';
		}
		switch ($_REQUEST['page']) {
			case 'save_blob':
				$this->page_save_blob();
				break;
			case 'get_blob':
				$this->page_get_blob();
				break;
			case 'list_blob':
				$this->page_list_blob();
				break;
			default:
				$html = file_get_contents('static/html/index2.html');
				print $html;
		}
	}

	function page_save_blob() {
		$resp = Array();
		$resp['success'] = true;
		$blob = $_REQUEST['blob'];
		$blob64 = base64_encode($blob);
		$salt = mysql_real_escape_string($_REQUEST['salt']);
		$name = mysql_real_escape_string($_REQUEST['name']);
		$pid = $this->genpid();
		$fmt = "Y-m-d H:i:s";
		$cdate = date($fmt);
		$exp = strftime($fmt, time() + 3600);
		$query = "INSERT INTO `blobs` (`pid`, `date_init`, `date_expire`, `salt`, `blob`, `name`) VALUES ('$pid', '$cdate', '$exp', '$salt', '$blob64', '$name')";
		$res = $this->db->query($query);
		$query = "SELECT * FROM `blobs` where pid='$pid'";
		$res = $this->db->query($query);
		if (!count($res)) {
			$resp['success'] = false;
			header('Content-Type:text/plain');
			print json_encode($resp);
			return;
		}
		$resp['pid'] = $res[0]['pid'];
		header('Content-Type:text/plain');
		print json_encode($resp);
	}
	
	function page_get_blob() {
		$pid = mysql_real_escape_string($_REQUEST['pid']);
		$resp = Array();
		$resp['success'] = true;
		$query = "SELECT * FROM `blobs` where pid='$pid'";
		$res = $this->db->query($query);
		if (!count($res)) {
			$resp['success'] = false;
			header('Content-Type:text/plain');
			print json_encode($resp);
			return;
		}
		$resp['blob'] = $res[0]['blob'];
		$resp['salt'] = $res[0]['salt'];
		header('Content-Type:text/plain');
		print json_encode($resp);
	}

	function page_list_blob() {
		$resp = Array();
		
		if (isset($_REQUEST['query']) and strlen($_REQUEST['query'])) {
			$str = mysql_real_escape_string($_REQUEST['query']);
			$where = "
				WHERE pid = '$str'
				OR name = '$str'
				OR syntax = '$str'
			";
		} else $where = '';
		
		$query = "SELECT count(*) AS count FROM `blobs` $where";
		$res = $this->db->query($query);
		$count = $res[0]['count'];
		$start = $_REQUEST['start'];
		$limit = $_REQUEST['limit'];
		if ($count < 1) {
			$resp['data'] = Array();
			$resp['count'] = 0;
		} else {
			$query = "
				SELECT pid, LEFT(`blob`, 80) AS 'blob', date_init, salt, name, syntax
				FROM `blobs` 
				$where 
				ORDER BY bid
				LIMIT $start, $limit
			";
			$res = $this->db->query($query);
			$resp['count'] = $count;
			$resp['data'] = $res;
		}	
		header('Content-Type:text/plain');
		print json_encode($resp);
	}


	function genpid() {
		$pid = substr(md5((string)rand()), 0, 12);
		return $pid;
	}
}

class db {

	function db() {
		require_once './srv/php/db_conf.php';
		$this->link = mysql_connect($db_host, $db_user, $db_password);
		mysql_select_db($db_name);
	}

	function query($query) {
		$rows = Array();
		$res = mysql_query($query);
		while ($row = @mysql_fetch_assoc($res)) {
			$rows[] = $row;
		}
		return $rows;
	}
}

$app = new gluebean();
$app->start();

?>
