/* 
 * The contents of this file is licenced. You may obtain a copy of
 * the license at http://sieve.mozdev.org or request it via email 
 * from the author. Do not remove or change this comment. 
 * 
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 */

 "use strict";
  
//****************************************************************************//

//<envelope> [COMPARATOR] [ADDRESS-PART] [MATCH-TYPE] 
//  <envelope-part: string-list> <key-list: string-list>
   
function SieveEnvelope(docshell,id) 
{
  SieveAbstractElement.call(this,docshell,id);
  
  this.whiteSpace = [];
  this.whiteSpace[0] = this._createByName("whitespace"," ");
  this.whiteSpace[1] = this._createByName("whitespace"," ");
  this.whiteSpace[2] = this._createByName("whitespace"," ");
  this.whiteSpace[3] = this._createByName("whitespace"," ");
  this.whiteSpace[4] = this._createByName("whitespace"," ");
  this.whiteSpace[5] = this._createByName("whitespace"," ");
  
  this.addressPart = this._createByName("address-part");
  this.matchType = this._createByName("match-type");
  this.comparator = this._createByName("comparator")  
  
  this.envelopeList = this._createByName("stringlist");
  this.keyList = this._createByName("stringlist");
}

SieveEnvelope.prototype.__proto__ = SieveAbstractElement.prototype;

SieveEnvelope.isElement
  = function(token)
{ 
  return (token.indexOf("envelope") == 0);
}

SieveEnvelope.prototype.init
    = function (data)
{
  data = data.slice("envelope".length);
  data = this.whiteSpace[0].init(data);
  
  while (true)
  {
    if (this.addressPart.isOptional() && this._probeByName("address-part",data))
    {
      data = this.addressPart.init(data)
      data = this.whiteSpace[1].init(data);
      
      continue;
    }
    
    if (this.comparator.isOptional() && this._probeByName("comparator",data))
    {
      data = this.compatator.init(data);
      data = this.whiteSpace[2].init(data);
      
      continue;
    }
    
    if (this.matchType.isOptional() && this._probeByName("match-type",data))
    {
      data = this.matchType.init(data);      
      data = this.whiteSpace[3].init(data);
      
      continue;
    }
    
    break;    
  }
  
  data = this.envelopeList.init(data);
  
  data = this.whiteSpace[4].init(data);
  
  data = this.keyList.init(data);
    
  data = this.whiteSpace[5].init(data);
  
  return data;
}    

SieveEnvelope.prototype.require
    = function (requires)
{
  requires["envelope"] = true;
}

SieveEnvelope.prototype.toScript
    = function ()
{
  return "envelope"
    + this.whiteSpace[0].toScript()
    + this.addressPart.toScript()
    + (!this.addressPart.isOptional() ? this.whiteSpace[1].toScript() : "" )
    + this.comparator.toScript()
    + (!this.comparator.isOptional() ? this.whiteSpace[2].toScript() : "" )
    + this.matchType.toScript()
    + (!this.matchType.isOptional() ? this.whiteSpace[3].toScript(): "" )
    + this.envelopeList.toScript()
    + this.whiteSpace[4].toScript()
    + this.keyList.toScript()
    + this.whiteSpace[5].toScript();
}

SieveEnvelope.prototype.toWidget
    = function ()
{
  return $("<div/>").text("envelope:"+this.toScript());  
}

/******************************************************************************/


//address [ADDRESS-PART] [COMPARATOR] [MATCH-TYPE]
//             <header-list: string-list> <key-list: string-list>

             
/* 
 * The contents of this file is licenced. You may obtain a copy of
 * the license at http://sieve.mozdev.org or request it via email 
 * from the author. Do not remove or change this comment. 
 * 
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 */
 
function SieveAddress(docshell,id)
{
  SieveAbstractElement.call(this,docshell,id); 
  
  this.options = new Array(null,null,null);
  
  this.whiteSpace = []
  this.whiteSpace[0] = this._createByName("whitespace"," ");
  this.whiteSpace[1] = this._createByName("whitespace"," ");
  this.whiteSpace[2] = this._createByName("whitespace"," ");
  this.whiteSpace[3] = this._createByName("whitespace"," ");
  this.whiteSpace[4] = this._createByName("whitespace"," ");
  this.whiteSpace[5] = this._createByName("whitespace"," ");
                
  this.addressPart = this._createByName("address-part");
  this.matchType = this._createByName("match-type");
  this.comparator = this._createByName("comparator")
  
  this.headerList = this._createByName("stringlist","\"To\"");
  this.keyList = this._createByName("stringlist","\"me@example.com\"");
}

SieveAddress.prototype.__proto__ = SieveAbstractElement.prototype;

SieveAddress.isElement
    = function (token)
{
  return (token.substr(0,7).toLowerCase().indexOf("address") == 0);
}

SieveAddress.prototype.init
    = function (data)
{
  data = data.slice("address".length);
  data = this.whiteSpace[0].init(data);
  
  while (true)
  {
    if (this.addressPart.isOptional() && this._probeByName("address-part",data))
    {
      data = this.addressPart.init(data)
      data = this.whiteSpace[1].init(data);
      
      continue;
    }
    
    if (this.comparator.isOptional() && this._probeByName("comparator",data))
    {
      data = this.compatator.init(data);
      data = this.whiteSpace[2].init(data);
      
      continue;
    }
    
    if (this.matchType.isOptional() && this._probeByName("match-type",data))
    {
      data = this.matchType.init(data);      
      data = this.whiteSpace[3].init(data);
      
      continue;
    }
    
    break;    
  }
  
  data = this.headerList.init(data);
  
  data = this.whiteSpace[4].init(data);
  
  data = this.keyList.init(data);
    
  data = this.whiteSpace[5].init(data);
  
  return data;
}    

SieveAddress.prototype.toScript
    = function ()
{
 
  return "address"
    + this.whiteSpace[0].toScript()
    + this.addressPart.toScript()
    + ((!this.addressPart.isOptional()) ? this.whiteSpace[1].toScript() : "" )
    + this.comparator.toScript()
    + ((!this.comparator.isOptional()) ? this.whiteSpace[2].toScript() : "" )
    + this.matchType.toScript()
    + ((!this.matchType.isOptional()) ? this.whiteSpace[3].toScript(): "" )
    + this.headerList.toScript()
    + this.whiteSpace[4].toScript()
    + this.keyList.toScript()
    + this.whiteSpace[5].toScript();
}

SieveAddress.prototype.toWidget
    = function ()
{
  return (new SieveAddressUI(this));
}

/******************************************************************************/

function SieveBoolean(docshell,id) 
{
  SieveAbstractElement.call(this,docshell,id);
  
  // first line with deadcode
  this.whiteSpace = this._createByName("whitespace");  
  
  this.value = false;
}

SieveBoolean.prototype.__proto__ = SieveAbstractElement.prototype;

SieveBoolean.isElement
 = function(data)
{
  data = data.substr(0,5).toLowerCase();
  if (data.indexOf("true") == 0)
    return true;
  if (data.indexOf("false") == 0)
    return true;
  
  return false;
}

SieveBoolean.prototype.init
    = function (data)
{
  var token = data.substr(0,5).toLowerCase();
  
  if (token.indexOf("true") == 0)
  {
    this.value = true
    data = data.slice("true".length);
  }
  
  if (token.indexOf("false") == 0)
  {
    this.value = false;
    data = data.slice("false".length);
  }
  
  data = this.whiteSpace.init(data);
    
  return data;    
}    


SieveBoolean.prototype.toScript
    = function ()
{
  if (this.value)
    return "true"+this.whiteSpace.toScript();

  return "false"+this.whiteSpace.toScript();    
}

SieveBoolean.prototype.toWidget
    = function ()
{
  return (new SieveBooleanTestUI(this));
}

/******************************************************************************/    
function SieveSize(docshell,id) 
{
  SieveAbstractElement.call(this,docshell,id); 
  
  this.whiteSpace = [];
  this.whiteSpace[0] = this._createByName("whitespace", " ");
  this.whiteSpace[1] = this._createByName("whitespace", " ");
  this.whiteSpace[2] = this._createByName("whitespace", " ");
  
  this.over = false;
  this.size = this._createByName("atom/number");
}

SieveSize.prototype.__proto__ = SieveAbstractElement.prototype;

SieveSize.isElement
  = function(token)
{ 
  return (token.substr(0,4).toLowerCase().indexOf("size") == 0);
}

SieveSize.prototype.init
    = function (data)
{
  // Syntax :
  // <"size"> <":over" / ":under"> <limit: number>
  
  data = data.slice("size".length);
  
  data = this.whiteSpace[0].init(data);
  
  var token = data.substr(0,6).toLowerCase();
  if (token.indexOf(":over") == 0) 
  {
    data=data.slice(":over".length)
    this.isOver(true);
  }
  else if (token.indexOf(":under") == 0)
  {
    data=data.slice(":under".length)
    this.isOver(false);
  }
  else 
    throw "Syntaxerror, :under or :over expected";
    
  data = this.whiteSpace[1].init(data);
  data = this.size.init(data);
  data = this.whiteSpace[2].init(data);
  
  return data;
}    

/**
 * Gets and Sets the over operator
 * @param @optional {BOOL} value
 * @return {}
 */
SieveSize.prototype.isOver
    = function (value)
{
  if (typeof(value) === "undefined")
    return this.over;
  
  if (typeof(value) === "string")
    value = ((""+value).toLowerCase() == "true")?  true: false;
  
  this.over = value;
  
  return this;
}

SieveSize.prototype.getSize
    = function ()
{
  return this.size;  
} 

SieveSize.prototype.toScript
    = function ()
{
  return "size"
    + this.whiteSpace[0].toScript()
    + ((this.isOver())?":over":":under")
    + this.whiteSpace[1].toScript()
    + this.getSize().toScript()
    + this.whiteSpace[2].toScript();
}

SieveSize.prototype.toWidget
    = function ()
{
  return (new SieveSizeTestUI(this));      
}

/******************************************************************************/
  
function SieveExists(docshell,id)
{
  SieveAbstractElement.call(this,docshell,id); 
  
  this.whiteSpace = [];
  this.whiteSpace[0] = this._createByName("whitespace",' ' );
  this.whiteSpace[1] = this._createByName("whitespace",' ');
  
  this.headerNames = this._createByName("stringlist",'"From"');
}

SieveExists.prototype.__proto__ = SieveAbstractElement.prototype;

SieveExists.isElement
  = function(token)
{ 
  return (token.indexOf("exists") == 0);
}

SieveExists.prototype.init
    = function (data)
{
  // Syntax :
  // <"exists"> <header-names: string-list>
  if (!SieveExists.isElement(data))
    throw "exists expected";
    
  data = data.slice("exists".length);
  
  data = this.whiteSpace[0].init(data);
  
  data = this.headerNames.init(data);
    
  data = this.whiteSpace[1].init(data);
  
  return data;
    
}    

SieveExists.prototype.toScript
    = function ()
{
  return "exists"
    + this.whiteSpace[0].toScript()
    + this.headerNames.toScript()
    + this.whiteSpace[1].toScript();
}

SieveExists.prototype.toWidget
    = function ()
{
  return (new SieveExistsUI(this));  
}

/******************************************************************************/
    
function SieveHeader(docshell,id) 
{
  SieveAbstractElement.call(this,docshell,id); 
  
  this.whiteSpace = [];
  this.whiteSpace[0] = this._createByName("whitespace"," ");
  this.whiteSpace[1] = this._createByName("whitespace"," ");  
  this.whiteSpace[2] = this._createByName("whitespace"," ");
  this.whiteSpace[3] = this._createByName("whitespace"," ");
  this.whiteSpace[4] = this._createByName("whitespace"," ");
  
  this.headerNames = this._createByName("stringlist",'"Subject"');
  this.keyList = this._createByName("stringlist",'"Example"');
 
  this.matchType = this._createByName("match-type");
  this.comparator = this._createByName("comparator");  
  
}

SieveHeader.prototype.__proto__ = SieveAbstractElement.prototype;

SieveHeader.isElement
    = function (token)
{
  return (token.substring(0,6).toLowerCase().indexOf("header") == 0);
} 

SieveHeader.prototype.init
    = function (data)
{
  // Syntax :
  // <"header"> [COMPARATOR] [MATCH-TYPE] <header-names: string-list> <key-list: string-list>         
  
  data = data.slice("header".length);
  
  data = this.whiteSpace[0].init(data);
  
  // It can be [Comparator] [MATCH-TYPE] or [MATCH-TYPE] [COMPARATOR]  
  while (true)
  {
    if (this.comparator.isOptional() && this._probeByName("comparator",data))
    {
      data = this.comparator.init(data);
      data = this.whiteSpace[1].init(data);
      
      continue;
    }
    
    if (this.matchType.isOptional() && this._probeByName("match-type",data))
    {
      data = this.matchType.init(data);      
      data = this.whiteSpace[2].init(data);
      
      continue;
    }
    
    break;    
  }

  
  data = this.headerNames.init(data);
  
  data = this.whiteSpace[3].init(data);
  
  data = this.keyList.init(data);
  
  data = this.whiteSpace[4].init(data);
  
  return data;    
}

SieveHeader.prototype.keys
    = function(idx)
{
  if (typeof(idx) === "undefined")
    return this.keyList;  
    
  return this.keyList.item(idx);
}

SieveHeader.prototype.headers
    = function(idx)
{
  if (typeof(idx) === "undefined")
    return this.headerNames;    
    
  return this.headerNames.item(idx);
}

SieveHeader.prototype.toScript
    = function ()
{
  
  // Yes, we normalize match types...
  // ... sorry about that 
  return "header"
    + this.whiteSpace[0].toScript()
    + this.comparator.toScript()
    + (!this.comparator.isOptional() ? this.whiteSpace[1].toScript() : "" ) 
    + this.matchType.toScript()
    + (!this.matchType.isOptional() ? this.whiteSpace[2].toScript(): "" )
    + this.headerNames.toScript()    
    + this.whiteSpace[3].toScript()
    + this.keyList.toScript()
    + this.whiteSpace[4].toScript()
}

SieveHeader.prototype.toWidget
    = function ()
{  
  return (new SieveHeaderUI(this));
}


// TODO SHould inherrit from block...
function SieveTestList(docshell,id)
{
  SieveAbstractElement.call(this,docshell,id);
  this.tests = [];  
}

SieveTestList.prototype.__proto__ = SieveAbstractElement.prototype;

SieveTestList.isElement
   = function (token)
{
  return (token.charAt(0) == "(")
}

SieveTestList.prototype.init
    = function (data)
{    
  if (data.charAt(0) != "(")
    throw "Test list expected but found:\n'"+data.substr(0,50)+"'...";
    
  data = data.slice(1);
    
  while (data.charAt(0) != ")")
  {
    if (data.charAt(0) == ",")
      data = data.slice(1);
            
    var element = [];
    
    element[0] = this._createByName("whitespace");  
    if (this._probeByName("whitespace",data))
      data = element[0].init(data);
    
    if (this._probeByClass(["test"],data))
      element[1] = this._createByClass(["test"],data)
    else
      throw "Test command expected but found:\n'"+data.substr(0,50)+"'...";        

    data = element[1].init(data);
    
    element[2] = this._createByName("whitespace");
    if (this._probeByName("whitespace",data))
      data = element[2].init(data);
        
    this.tests.push(element);
  }
  
  data = data.slice(1);
   
  return data;
}


SieveTestList.prototype.toScript
    = function()
{
  var result = "("
    
  for (var i = 0;i<this.tests.length; i++)
  {
    result = result
             + ((i>0)?",":"")
             + this.tests[i][0].toScript()
             + this.tests[i][1].toScript()
             + this.tests[i][2].toScript();    
  }
  
  result += ")";
  
  return result;  
}

SieveTestList.prototype.require
    = function (imports)
{
  for (var i=0; i<this.tests.length; i++)
    this.tests[i][1].require(imports)
}

//****************************************************************************/
function SieveAnyOfAllOfTest(docshell,id)
{
  SieveTestList.call(this,docshell,id);  
  this.whiteSpace = this._createByName("whitespace");
}

// Inherrit TestList
SieveAnyOfAllOfTest.prototype.__proto__ = SieveTestList.prototype;

SieveAnyOfAllOfTest.isElement
   = function (token)
{
  if ( token.substring(0,5).toLowerCase().indexOf("allof") == 0)
    return true;
    
  if ( token.substring(0,5).toLowerCase().indexOf("anyof") == 0)
    return true;
    
  return false;
}

SieveAnyOfAllOfTest.prototype.init
    = function (data)
{
  if ("allof" == data.substring(0,5).toLowerCase())
    this.isAllOf = true;
  else if ("anyof" == data.substring(0,5).toLowerCase())
    this.isAllOf = false;
  else
    throw "allof or anyof expected but found: \n"+data.substr(0,50)+"...";
    
  data = data.slice(5);  
  data = this.whiteSpace.init(data);
  
  data = SieveTestList.prototype.init.call(this,data);
  
  return data;
}

SieveAnyOfAllOfTest.prototype.toScript
    = function()
{
  return (this.isAllOf?"allof":"anyof")
           + this.whiteSpace.toScript()
           + SieveTestList.prototype.toScript.call(this);  
}

SieveAnyOfAllOfTest.prototype.toWidget
    = function ()
{
  return (new SieveAnyOfAllOfUI(this));
}


if (!SieveLexer)
  throw "Could not register Conditional Elements";

SieveLexer.register("test","test/address",SieveAddress);
SieveLexer.register("test","test/boolean",SieveBoolean);
SieveLexer.register("test","test/envelope",SieveEnvelope);
SieveLexer.register("test","test/exists",SieveExists);  
SieveLexer.register("test","test/header",SieveHeader);
SieveLexer.register("test","test/size",SieveSize);

SieveLexer.register("test","test/anyof",SieveAnyOfAllOfTest);
SieveLexer.register("test/","test/testlist",SieveTestList);
