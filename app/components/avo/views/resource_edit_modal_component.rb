# frozen_string_literal: true

class Avo::Views::ResourceEditModalComponent < Avo::Views::ResourceEditComponent
  def initialize(resource: nil, model: nil, actions: [], view: :edit, parent_component: nil)
    @parent_component = parent_component
    super(resource: resource, model: model, actions: actions, view: view )
  end
end
