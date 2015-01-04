var NOOT = nootrequire('api', 'object');

describe('NOOT.API.Queryable', function() {

  it('should have property from mixin', function() {
    var Parent = NOOT.Object.extend(NOOT.API.Queryable);
    var Child = NOOT.Object.extend(NOOT.API.Queryable);

    var parent = Parent.create({
      __selectable: ['fromParent']
    });

    var child = Child.create({
      _queryableParent: parent,
      __filterable: ['fromChild']
    });

    child.selectable.should.deep.eql(['fromParent']);
    child.filterable.should.deep.eql(['fromChild']);
    child.sortable.should.deep.eql([]);
  });




});