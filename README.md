# Supported Engines

The xUnit.js framework is host-agnostic, and provides strategies for interacting with various environments, host engines and file I/O systems. 

Included are strategies for: 
+ Chrome v8 (d8 development console)
+ Mozilla SpiderMonkey (jsdb console)
+ Microsoft Script Engine (cscript console)

Additional engines can be added by implementing and registering new classes based on the System.Environment.IEnvironmentStrategy, System.IO.Directory.IDirectoryStrategy, and System.IO.File.IFileStrategy interfaces. Planned implementations include Rhino (Mozilla) and JavascriptCore (Webkit/Safari), as well as a bridging mechanism to run the Microsoft Script Engine during automation.

# Concepts

The xUnit.js SDK and console runner are designed to facilitate Arrange-Act-Assert (see also: http://www.arrangeactassert.com/why-and-what-is-arrange-act-assert/) and Single-Assert (see also: http://www.owenpellegrin.com/blog/testing/how-do-you-solve-multiple-asserts/) patterns in unit tests. Script files contain single-assert tests known as Facts, which can be grouped logically under classes known as Fixtures. Fixtures can be nested. This facilitates statement based testing by allowing a Fact to be named according to the premise it attempts to falsify, while using Fixture names to clarify the Namespace, Class, and Method being exercised. This results in clear, easy to understand target paths such as Test.Some.Class.Extends.AddsParentReferenceToInstance.

# Test Creation

## Files

Test files contain classic Javascript classes instead of JSON blobs or otherwise artificially restricted language syntax. This provides natural organization to developers comfortable with Javascript, and allows for internal and external object state through standard closure and property mechanisms. 

## Organization

Files are generally organized on a Fixture-per-File basis. That is to say, the file declares an intended namespace, and creates a single Fixture representing the entire file or class being tested. Beneath this Fixture, additional Fixtures are added on a Class or Method basis, creating logical groupings of Facts expressing simple falsifiable statements about the code being exercised.

## Setup and Teardown

Setup and teardown are intentionally omitted from the xUnit.js framework; their use indicates complexity that should not be hidden from humans reading the unit tests. Alternatives exist for very specific use cases, but are intentionally painful to prevent abuse.

## Declaration

Facts and Fixtures are declared by using C# style attribution (similar to Java annotations) preceding the method being decorated. This attribution allows for declarative rather than functional registration of Facts and Fixtures, in a style familiar to NUnit or xUnit users. 

[Fixture]
function StringTests(){
    
    [Fixture]
    function ltrim(){

        [Fact]
        function TrimsLeadingSpace(){
            // Arrange
            var expected="expected";

            // Act
            var actual=MyApp.String.ltrim(" "+expected);

            // Assert
            Assert.Equal(expected,actual);
        }

        [Fact]
        function TrimsLeadingTab(){
            // Arrange
            var expected="expected";

            // Act
            var actual=MyApp.String.ltrim("\t"+expected);

            // Assert
            Assert.Equal(expected,actual);
        }

        [Fact]
        function TrimsLeadingNewLine(){
            // Arrange
            var expected="expected";

            // Act
            var actual=MyApp.String.ltrim("\n"+expected);

            // Assert
            Assert.Equal(expected,actual);
        }

    }

}

See the section on Examples below for additional information.

## Importing Dependencies

All tests have dependencies, at a minimum, the class or file being tested. To facilitate loading these, the default Import attribute of the xUnit.js console runner has been extended with awareness of the application's directory structure. All import statements start from the parent of the core directory, allowing tests to be run equally easily from different branches.

[Import("app/config/MyApp.js")]
[Import("app/config/MyApp.String.js")]
[Fixture]
function StringTests(){
    
    [...]

}

See the section on Examples below for additional information.

## Skipping Facts or Fixtures

xUnit.js provides the ability to indefinitely skip a Fact or Fixture by supplying a Skip attribute, with an optional reason.

[Fixture,Skip]
function ObsoleteStringTests(){
    [...]
}

[Fixture]
function StringTests(){

    [Fixture]
    function ltrim(){

        [Fact,Skip("We need to support unicode characters. Refactoring.")]
        function RemovesUnicodeCharacters(){
            [...]
        }

    }

}

See the section on Examples below for additional information.

## Declaring Traits

xUnit.js provides the ability to specify arbitrary trait information on Facts or Fixtures. This can be used to group similar concepts that span across multiple Facts, Fixtures, and Files into common test runs. These traits can be specified in a comma delimited list to the console runner trait or -trait arguments or ant target properties jstest.trait or jstest.-trait. In practice, this can be used to isolate Integration tests from Strict unit tests.

[Fixture,Trait("Integration")]
function DomIntegrationTests(){
    [...]
}

[Fixture]
function StringTests(){

    [Fixture]
    function ltrim(){

        [Fact,Trait("UnicodeSupport")]
        function ProcessesUnicodeCharacters(){
            [...]
        }

    }

}

See the section on Examples below for additional information.

## Asserting Fact Statements

Assertions are provided by the xUnit.js.Assert class (globally available as Assert in tests). The following static methods are supported:

Assert.AssignableFrom(expected, actual);

Assert.Contains(expected, actual);

Assert.DoesNotContain(expected, actual);

Assert.DoesNotThrow(actual);

Assert.Empty(actual);

Assert.Equal(expected, actual);

Assert.Fail(reason);

Assert.False(actual,message);

Assert.InRange(actual,low,high,comparer);

Assert.NotEmpty(actual);

Assert.NotEqual(expected, actual);

Assert.NotInRange(actual,low,high,comparer);

Assert.NotNull(actual);

Assert.NotSame(expected, actual);

Assert.NotType(expected, actual);

Assert.NotUndefined(actual);

Assert.Null(actual);

Assert.Same(expected, actual);

Assert.Throws(expected, actual);

Assert.True(actual,message);

Assert.Type(expected, actual);

Assert.Undefined(actual);

See the section on Examples below for additional information.

## Handling Exceptions

Rather than specifying that an exception is expected when calling a method, xUnit.js provides functionality for recording thrown exceptions in a manner that still allows for normal Arrange-Act-Assert patterns. This is accomplished by using Record.Exception() to catch the error that is thrown during method invocation.

[Fixture]
function StringTests(){
    
    [Fixture]
    function getIntValue(){

        [Fact]
        function ThrowsIfRadixIsZero(){
            // Arrange
            var expected="Radix not equal to 0 must be supplied"'

            // Act
            var actual=Record.Exception(function(){
                MyApp.String.getIntValue("",0);
            });

            // Assert
            Assert.Equal(expected,actual);
        }

    }

}

See the section on Examples below for additional information.

## Mocking Members

Members of existing Objects can be easily mocked for the duration of an invocation. For this purpose, use the Test.Tools.MyApp.Mocks class (globally available as Mocks in tests):

var mockMethod=Mocks.GetMock(targetInstance,"targetMember",mock); 

To test your Fact statement in the context of the mock, call the mockMethod with a Function delegate. This delegate will be executed by the mockMethod after replacing the specified "targetMember" on the targetInstance with the suggested mock object or method. Upon completion of the delegate, the mocked member will be restored to its original value. To access the original value, you can use the property .mocked on the suggested mock object or method. 

Note that for obvious reasons it is not possible to access the original value via mock.mocked if the value of mock is null or undefined.

[Fixture]
function StringTests(){
    
    [Fixture]
    function ltrim(){

        [Fact]
        function CallsStringReplace(){
            // Arrange
            var target="target";
            var mockReplace=Mocks.GetMock(String.prototype,"replace",function(targetRegEx,targetReplacement){
                actual=true;
                return arguments.callee.mocked(targetRegEx,targetReplacement);
            });
            var actual=null;

            // Act
            mockReplace(function(){
                MyApp.String.ltrim(" "+target);
            });

            // Assert
            Assert.True(actual);
        }

    }

}

See the section on Examples below for additional information.

## Using Stubs

Some objects or classes require many, complex, structural or hierarchical dependencies. To facilitate boundary testing, these dependencies can be supplied via Stubs. Stubbed objects supply property and method expectations. Stubbed methods -- including methods on stubbed objects -- provide rudimentary recording, reporting, and expectation functionality, such as tracking the number of invocations; storing the arguments supplied to the method; and allowing the return value of the method to be set explicitly. To create stubs, use the Test.Tools.MyApp.Stubs.StubFactory class (globally available as Stubs in tests):

var stubMethod=Stubs.CreateMethod(targetInstance,methodName,[argumentName...],returnValue);

var stubMethod=Stubs.CreateVoidMethod(targetInstance,methodName,[argumentName...]);

var stubObject=Stubs.CreateObject({methodName:{}},{propertyName:"propertyValue"});

var stubObject=Stubs.CreateObject(
    {
        methodName:{
            arguments:["argumentNameOne","argumentNameTwo"],
            returnValue:"Return Value"
        }
    },{
        propertyName:"propertyValue"
    }
);

var stubList=Stubs.CreateList(inputList,{methodName:{}},{propertyName:"propertyValue"});

See the section on Examples below for additional information.

