module Avo
  module Hosts
    class ScopeHost < BaseHost
      option :query
      option :resource
      option :scope
      option :arguments, default: proc { {} }

      def scoped_query
        @scoped_query ||= scope.apply_query(params, query, resource: resource)
      end
    end
  end
end
