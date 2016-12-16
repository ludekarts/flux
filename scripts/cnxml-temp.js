const cnxmlModule = (content) => {
  return `
    <document xmlns="http://cnx.rice.edu/cnxml" xmlns:md="http://cnx.rice.edu/mdml" xmlns:bib="http://bibtexml.sf.net/" xmlns:m="http://www.w3.org/1998/Math/MathML" xmlns:q="http://cnx.rice.edu/qml/1.0" xmlns:data="http://www.w3.org/TR/html5/dom.html#custom-data-attribute" id="new" cnxml-version="0.7" module-id="new">
    <title>Back To The Future</title>
    <metadata xmlns:md="http://cnx.rice.edu/mdml" mdml-version="0.5">
      <md:repository>http://legacy.cnx.org/content</md:repository>
      <md:content-id>new</md:content-id>
      <md:title>Back To The Future</md:title>
      <md:version>**new**</md:version>
      <md:created>2016/12/12 01:06:28.446 US/Central</md:created>
      <md:revised>2016/12/12 01:06:28.660 US/Central</md:revised>
      <md:actors>
        <md:person userid="ludekarts">
          <md:firstname>Wojciech</md:firstname>
          <md:surname>Ludwin</md:surname>
          <md:fullname>Wojciech Ludwin</md:fullname>
          <md:email>ludekarts@gmail.com</md:email>
        </md:person>
      </md:actors>
      <md:roles>
        <md:role type="author">ludekarts</md:role>
        <md:role type="maintainer">ludekarts</md:role>
        <md:role type="licensor">ludekarts</md:role>
      </md:roles>
      <md:license url="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution License 4.0</md:license>
      <md:keywordlist>
        <md:keyword>Phisics, Science Fiction, Time</md:keyword>
      </md:keywordlist>
      <md:subjectlist>
        <md:subject>Science and Technology</md:subject>
      </md:subjectlist>
      <md:abstract>Back to the Future is a 1985 American science fiction adventure comedy film directed by Robert Zemeckis and written by Zemeckis and Bob Gale.</md:abstract>
      <md:language>en</md:language>
    </metadata>  
    <content>
      ${content}
    </content>
  </document>`;
  };
