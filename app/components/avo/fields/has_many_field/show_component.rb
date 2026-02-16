# frozen_string_literal: true

class Avo::Fields::HasManyField::ShowComponent < Avo::Fields::ShowComponent
  def resource_name
    @resource.model_key
  end

  def field_name
    @field.id.to_s
  end

  def has_many_url
    return nil unless @resource.model&.persisted?
    @field.frame_url
  end

  def field_label
    @field.name.to_s.humanize
  end

  def initially_expanded?
    false # JavaScript handles state restoration
  end
end
