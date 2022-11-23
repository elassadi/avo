module Avo
  module Fields
    module Concerns
      module IsUpdatable
        extend ActiveSupport::Concern

        def is_updatable?
          return updatable unless updatable.nil?

          !is_readonly?
        end
      end
    end
  end
end
