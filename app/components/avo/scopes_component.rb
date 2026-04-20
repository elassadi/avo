# frozen_string_literal: true

class Avo::ScopesComponent < ViewComponent::Base
  include Avo::ApplicationHelper

  def initialize(scopes: [], resource: nil, applied_scope: nil, parent_model: nil, query: nil, turbo_frame: nil)
    @scopes = scopes
    @resource = resource
    @applied_scope = applied_scope
    @parent_model = parent_model
    @query = query
    @turbo_frame = turbo_frame
  end

  def render?
    @scopes.present?
  end

  def scope_path(scope)
    helpers.resources_path(resource: @resource, scope: scope.id, keep_query_params: true)
  end

  def active?(scope)
    @applied_scope.to_s == scope.id.to_s
  end

  def label(scope)
    scope.computed_name(resource: @resource, query: @query)
  end

  def tooltip(scope)
    scope.computed_description(resource: @resource, query: @query)
  end
end
