module Avo
  module FiltersHelper

    def filters_session_key
      @filters_session_key ||= begin
        key = %w(turbo_frame controller resource_name related_name action id ).map do | key |
          params[key]
        end.compact.join("/")

        "/filters/#{key}"
      end
    end

    def filters_from_session
      session[filters_session_key]
    end

    def filters_from_params
      params[Avo::Filters::BaseFilter::PARAM_KEY].present? &&
        params[Avo::Filters::BaseFilter::PARAM_KEY]
    end

    def save_filters_to_session
      session[filters_session_key] = params[Avo::Filters::BaseFilter::PARAM_KEY]
    end

    def fetch_filters
      (filters_from_params && save_filters_to_session) || filters_from_session
    end

    def reset_filters
      session.delete(filters_session_key)
    end

  end
end
