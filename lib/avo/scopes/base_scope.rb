module Avo
  module Scopes
    class BaseScope
      PARAM_KEY = :scope unless const_defined?(:PARAM_KEY)

      class_attribute :name, default: "Scope"
      class_attribute :description, default: nil
      class_attribute :scope, default: nil
      class_attribute :visible, default: nil

      attr_reader :arguments

      delegate :params, to: Avo::App

      def initialize(arguments: {}, id: nil)
        @arguments = arguments
        @id = id
      end

      # Registration-level identity. Falls back to the class name so a manually instantiated
      # scope (e.g. in specs) still has a sensible id.
      def id
        @id || self.class.name.underscore.tr("/", "_")
      end

      def computed_name(resource:, query:)
        evaluate_option(self.class.name, resource: resource, query: query)
      end

      def computed_description(resource:, query:)
        evaluate_option(self.class.description, resource: resource, query: query)
      end

      def apply_query(request, query, resource:)
        case self.class.scope
        when Symbol
          query.public_send(self.class.scope)
        when Proc
          Avo::Hosts::ScopeHost.new(
            block: self.class.scope,
            query: query,
            resource: resource,
            scope: self,
            arguments: arguments
          ).handle
        else
          query
        end
      end

      def visible_in_view(resource: nil, parent_resource: nil)
        return true if self.class.visible.blank?

        Avo::Hosts::VisibilityHost.new(
          block: self.class.visible,
          params: params,
          parent_resource: parent_resource,
          resource: resource,
          arguments: arguments
        ).handle
      end

      private

      def evaluate_option(value, resource:, query:)
        return value unless value.respond_to?(:call)

        Avo::Hosts::ScopeHost.new(
          block: value,
          query: query,
          resource: resource,
          scope: self,
          arguments: arguments
        ).handle
      end
    end
  end
end
