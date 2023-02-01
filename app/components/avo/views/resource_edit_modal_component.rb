# frozen_string_literal: true

class Avo::Views::ResourceEditModalComponent < Avo::Views::ResourceEditComponent
  def form_url
    url = Addressable::URI.parse(super)
    params[:modal_resource].present? && params[:field_type].present? && params[:field_id].present?
    url.query = "modal_resource=1&field_type=#{params[:field_type]}&field_id=#{params[:field_id]}"

    url.to_s
  end
end
