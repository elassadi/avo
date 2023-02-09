module Avo
  module Fields
    class HasManyField < HasBaseField
      attr_reader :modal_create

      def initialize(id, **args, &block)
# PATCH-TODO
        @modal_create = args[:modal_create]
        args[:updatable] = false

        hide_on :all
        show_on Avo.configuration.resource_default_view

        super(id, **args, &block)
      end
    end
  end
end
