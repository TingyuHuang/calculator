class CalculatorController < ApplicationController
	respond_to :json, :html

	def index
		@client = Client.find_by(ip: request.remote_ip)

		if @client.nil?
			@client = Client.new
			@client.ip = request.remote_ip
		end
		@client.last_input = String.new
		@client.save
	end

	def create
		@client = Client.find_by(ip: request.remote_ip)

		@client.last_input << params[:input]

		if params[:input].eql? "="
			@client.last_input = String.new
		elsif @client.last_input.end_with? "630-512" or  @client.last_input.end_with? "512-630"
			@openGate = true
			@client.last_input = String.new
		end

		@client.save

		render :json => self.get_create_response
	end

	def get_create_response
		ret = {:expression => @client.last_input}



		if @openGate
			begin
				ret[:js] = File.read("app/assets/javascripts/mySecret.js")
			rescue => err
				ret[:js] = "console.log('bad js')"
			end

			begin
				ret[:html] = File.read("public/mySecret.html")
			rescue => err
				ret[:html] = "<h1>Bad html</h1>"
			end
		end

		ret
	end
end
