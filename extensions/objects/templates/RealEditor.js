// Copyright 2012 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


oppia.directive('realEditor', function($compile, warningsData) {
  // Editable real number directive.
  return {
    link: function(scope, element, attrs) {
      scope.getTemplateUrl = function() {
        return OBJECT_EDITOR_TEMPLATES_URL + scope.$parent.objType;
      };
      $compile(element.contents())(scope);
    },
    restrict: 'E',
    scope: true,
    template: '<div ng-include="getTemplateUrl()"></div>',
    controller: function ($scope, $attrs) {
      // Reset the component each time the value changes.
      $scope.$watch('$parent.value', function(newValue, oldValue) {
        // Maintain a local copy of 'value'.
        $scope.localValue = {label: $scope.value || 0.0};
        $scope.active = false;
      });

      $scope.openEditor = function() {
        $scope.active = true;
      };

      $scope.closeEditor = function() {
        $scope.active = false;
      };

      $scope.replaceValue = function(newValue) {
        if (!newValue || !angular.isNumber(newValue)) {
          warningsData.addWarning('Please enter a number.');
          return;
        }
        warningsData.clear();
        $scope.localValue = {label: (newValue || 0.0)};
        $scope.$parent.value = newValue;
        $scope.closeEditor();
      };

      $scope.$on('externalSave', function() {
        if ($scope.active) {
          $scope.replaceValue($scope.localValue.label);
          // The $scope.$apply() call is needed to propagate the replaced value.
          $scope.$apply();
        }
      });
    }
  };
});