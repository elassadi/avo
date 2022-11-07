module Avo
  module Licensing
    class License
      attr_accessor :id
      attr_accessor :response
      attr_accessor :valid
      attr_accessor :payload

      def initialize(response)
        @response = response
        @id = response["id"]
        @valid = response["valid"]
        @payload = response["payload"]
      end

      def valid?
        return true
        valid
      end

      def invalid?
        return false
        !valid?
      end

      def pro?
        return true
        id == "pro"
      end

      def error
        @response["error"]
      end

      def properties
        @response.slice("valid", "id", "error").symbolize_keys
      end

      def abilities
        []
      end

      def can(ability)
        return true
        abilities.include? ability
      end

      def cant(ability)
        return false
        !can ability
      end

      alias_method :has, :can
      alias_method :lacks, :cant

      # Returns if has ability and if is a valid license or app is in development.
      def has_with_trial(ability)
        return true
        return can(ability) && valid? if Rails.env.production?

        true
      end

      # Returns if lacks ability and if is a valid license or app is in development.
      def lacks_with_trial(ability)
        !has_with_trial ability
      end

      def name
        if id.present?
          id.humanize
        else
          self.class.to_s.split('::').last.underscore.humanize.gsub ' license', ''
        end
      end
    end
  end
end
