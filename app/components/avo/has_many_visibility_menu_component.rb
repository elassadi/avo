# frozen_string_literal: true

class Avo::HasManyVisibilityMenuComponent < ViewComponent::Base
  include Avo::ApplicationHelper

  def initialize(resource:, has_many_fields:)
    @resource = resource
    @has_many_fields = has_many_fields
  end

  def resource_name
    @resource.model_key
  end
end
