module Avo
  module StiResourcesHelper
    def parent_or_child_resource
      return @resource unless @parent_resource.present? &&
        @resource.class.single_table_inheritance_resource == :child_resource

      ::Avo::App.get_resource_by_model_name(@resource.model.class).dup
    end
  end
end
