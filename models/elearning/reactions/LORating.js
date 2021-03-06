var keystone = require('keystone');
var Types = keystone.Field.Types;

var LORating = new keystone.List('LORating', {
  nocreate: true,
  track: true,
});

LORating.add({
  learningObject: {
    type: Types.Relationship,
    initial: true,
    ref: 'LearningObject',
    noedit: true,
  },
  rating: { 
    type: Types.Select, 
    options: [
      { value: '1', label: "Poor" },
      { value: '2', label: "Fair" }, 
      { value: '3', label: "Neutral" }, 
      { value: '4', label: "Good" }, 
      { value: '5', label: "Excellent" }, 
    ], 
    required: true,
    noedit: true,
  },
});

LORating.defaultSort = '-createdAt';
LORating.defaultColumns = 'learningObject, createdBy, rating, createdAt';
LORating.register();
