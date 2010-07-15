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
			default:
				$html = file_get_contents('static/html/index.html');
				print $html;
		}
	}

	function page_save_blob() {
		$resp = Array();
		$resp['success'] = true;
		$blob = $_REQUEST['blob'];
		$blob64 = base64_encode($blob);
		$salt = mysql_real_escape_string($_REQUEST['salt']);
		$pid = $this->genpid();
		$fmt = "Y-m-d H:i:s";
		$cdate = date($fmt);
		$exp = strftime($fmt, time() + 3600);
		$query = "INSERT INTO `blobs` (`pid`, `date_init`, `date_expire`, `salt`, `blob`) VALUES ('$pid', '$cdate', '$exp', '$salt', '$blob64')";
		$res = $this->db->query($query);
		$query = "SELECT * FROM `blobs` where pid='$pid'";
		$res = $this->db->query($query);
		if (!count($res)) {
			$resp['success'] = false;
			print json_encode($resp);
			return;
		}
		$resp['pid'] = $res[0]['pid'];
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
			print json_encode($resp);
			return;
		}
		$resp['blob'] = $res[0]['blob'];
		$resp['salt'] = $res[0]['salt'];
		print json_encode($resp);
	}

	function genpid() {
		$pid = substr(md5((string)rand()), 0, 12);
		return $pid;
	}
}

class db {

	function db() {
		$this->link = mysql_connect("localhost", "gluebean", "gluebean");
		mysql_select_db("gluebean_dev");
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
