-- phpMyAdmin SQL Dump
-- version 2.11.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 15, 2010 at 11:52 PM
-- Server version: 5.0.51
-- PHP Version: 5.2.0-8+etch9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `gluebean_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `blobs`
--

CREATE TABLE IF NOT EXISTS `blobs` (
  `bid` int(10) unsigned NOT NULL auto_increment,
  `pid` varchar(32) NOT NULL,
  `date_init` datetime NOT NULL,
  `date_expire` datetime NOT NULL,
  `salt` varchar(16) NOT NULL,
  `blob` text NOT NULL,
  PRIMARY KEY  (`bid`),
  UNIQUE KEY `pid` (`pid`),
  KEY `date_init` (`date_init`),
  KEY `date_expire` (`date_expire`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;
