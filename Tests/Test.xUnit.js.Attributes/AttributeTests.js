Function.RegisterNamespace("Test.xUnit.js.Attributes");

[Fixture,Trait("Integration")]
Test.xUnit.js.Attributes.AttributeTests=function(){

    [Fixture]
    function TestFixtureEvents(){    
        var _beforeRun=false;
        var _afterRun=false;

        var model=arguments.callee.GetModel();
        model.Events.Add("BeforeRun",RunsBeforeFixture);
        model.Events.Add("AfterRun",RunsAfterFixture);

        function RunsBeforeFixture(){
            _beforeRun=true;
        }

        function RunsAfterFixture(){
            _afterRun=true;
        }
    
        [Fact]
        function ThrowsIfBeforeDidNotRun(){
            Assert.True(_beforeRun);
        }

        [Fact]
        function ThrowsIfAfterAlreadyRan(){
            Assert.False(_afterRun);
        }
    }

    [Fixture]
    function TestFactEvents(){    
        var _afterRun=false;

        function RunsAfterFact(){
            _afterRun=true;
        }

        [Fact]
        function SetAfterRun(){
            var model=arguments.callee.GetModel();            
            Assert.False(_afterRun);
            model.Events.Add("AfterRun",RunsAfterFact);
        }

        [Fact]
        function VerifyAfterRun(){
            Assert.True(_afterRun);
        }
    }
}
